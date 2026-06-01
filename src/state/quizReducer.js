import { shuffleArray, shuffleQuestionOptions, getSafeWeight, getTopKWeighted, calculateNewStats } from '../utils/ankiAlgorithm.js';
import { normalizeStats, BUILTIN_QUESTIONS, mergeWithBuiltins } from '../utils/questionParser.js';

// --- Reducer 狀態管理 ---
export const getInitialState = () => {
  const storedQuestions = JSON.parse(localStorage.getItem('anki_all_questions')) || [];
  const mergedQuestions = storedQuestions.length > 0 ? mergeWithBuiltins(storedQuestions) : (BUILTIN_QUESTIONS.length > 0 ? [...BUILTIN_QUESTIONS] : []);
  const hasQuestions = mergedQuestions.length > 0;

  // F5 即時整理：如果載入的當前題目批次（currentBatch）中有不隨機打亂的特定圖表題，
  // 我們在載入時直接以資料庫（mergedQuestions）中原始、未打亂的版本替換它，以確保選項順序為 A, B, C, D。
  const NO_SHUFFLE_CODES = ['EB020019', 'EB020098', 'EB020101', 'EB030072'];
  const rawBatch = JSON.parse(localStorage.getItem('anki_batch')) || [];
  const currentBatch = rawBatch.map(bq => {
    const m = bq.title.match(/^\[(EB\d+)\]/);
    const qCode = m ? m[1] : '';
    if (NO_SHUFFLE_CODES.includes(qCode)) {
      const originalQ = mergedQuestions.find(q => {
        const qm = q.title.match(/^\[(EB\d+)\]/);
        return qm && qm[1] === qCode;
      });
      if (originalQ) {
        return { ...originalQ };
      }
    }
    return bq;
  });

  const storedUserAnswers = JSON.parse(localStorage.getItem('anki_user_answers')) || [];
  const userAnswers = currentBatch.length > 0 
    ? (storedUserAnswers.length === currentBatch.length ? storedUserAnswers : Array(currentBatch.length).fill(null))
    : [];

  return {
    view: hasQuestions ? (localStorage.getItem('anki_view') || 'menu') : 'upload',
    allQuestions: mergedQuestions,
    currentBatch,
    userAnswers,
    currentIndex: parseInt(localStorage.getItem('anki_index')) || 0,
    score: parseFloat(localStorage.getItem('anki_score')) || 0,
    mode: localStorage.getItem('anki_mode') || 'weighted50',
    stats: normalizeStats(JSON.parse(localStorage.getItem('anki_stats')) || {}),
    questionsPerQuiz: parseInt(localStorage.getItem('anki_questions_per_quiz')) || 50,
    selectedOption: localStorage.getItem('anki_selected_option') || null,
    hasAnswered: localStorage.getItem('anki_has_answered') === 'true',
    correctCount: parseInt(localStorage.getItem('anki_correct_count')) || 0,
    skippedCount: parseInt(localStorage.getItem('anki_skipped_count')) || 0,
    lastQuizCandidateTitles: JSON.parse(localStorage.getItem('anki_last_quiz_candidate_titles')) || [],
    lastQuizMode: localStorage.getItem('anki_last_quiz_mode') || 'weighted50',
    categoryNames: JSON.parse(localStorage.getItem('anki_category_names')) || {},
    shuffleOptions: localStorage.getItem('anki_shuffle_options') !== 'false',
    scoringRules: { correct: 1, wrong: 0, skipped: 0, ...(JSON.parse(localStorage.getItem('anki_scoring_rules')) || {}) },
    errorLogs: [],
    lastActionTime: 0
  };
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, allQuestions: mergeWithBuiltins(action.payload.parsedQuestions), errorLogs: action.payload.errors, view: 'menu' };

    case 'UPDATE_QUESTIONS_MID_QUIZ': {
      const { parsedQuestions, errors } = action.payload;
      const newAllQuestions = mergeWithBuiltins(parsedQuestions);
      
      const getQCode = (title) => {
        const m = title.match(/^\[(EB\d+)\]/);
        return m ? m[1] : title;
      };

      const updatedBatch = state.currentBatch.map(bq => {
        const bqCode = getQCode(bq.title);
        const nq = newAllQuestions.find(q => getQCode(q.title) === bqCode);
        if (!nq) return bq;

        const NO_SHUFFLE_CODES = ['EB020019', 'EB020098', 'EB020101', 'EB030072'];
        if (NO_SHUFFLE_CODES.includes(bqCode)) {
          return { ...nq };
        }

        const labelMap = {};
        bq.options.forEach(opt => {
          const orig = opt.originalLabel || opt.label;
          labelMap[orig] = opt.label;
        });

        const updatedOptions = bq.options.map(opt => {
          const orig = opt.originalLabel || opt.label;
          const newOpt = nq.options.find(o => o.label === orig);
          return {
            ...opt,
            text: newOpt ? newOpt.text : opt.text
          };
        });

        const correctLabels = new Set(nq.answer.split(''));
        const newAnswerLabels = [];
        updatedOptions.forEach(opt => {
          const orig = opt.originalLabel || opt.label;
          if (correctLabels.has(orig)) {
            newAnswerLabels.push(opt.label);
          }
        });
        const newAnswer = newAnswerLabels.sort().join('');

        let finalExp = nq.explanation;
        const hasChange = Object.keys(labelMap).some(k => k !== labelMap[k]);
        if (hasChange && finalExp && finalExp.trim()) {
          const PH = 0xE000;
          const toP = (ch) => String.fromCharCode(PH + (labelMap[ch] || ch).charCodeAt(0) - 65);
          const remapSorted = (s) => {
            const mapped = s.split('').map(ch => labelMap[ch] || ch).sort();
            return mapped.map(ch => String.fromCharCode(PH + ch.charCodeAt(0) - 65)).join('');
          };
          finalExp = finalExp.replace(/\(([A-E]{1,5})\)(?![a-z])/g, (m, inner) => '(' + remapSorted(inner) + ')');
          finalExp = finalExp.replace(/選項\s*[\(（]([A-E])[\)）]/g, (m, lbl) => '選項(' + toP(lbl) + ')');
          finalExp = finalExp.replace(/選項\s*([A-E])(?![a-zA-Z])((?:\s*[與及和或、]\s*([A-E])(?![a-zA-Z]))*)/g, (m, lbl, rest) => {
            let r = '選項' + toP(lbl);
            if (rest) r += rest.replace(/([A-E])(?![a-zA-Z])/g, (m2, l2) => toP(l2));
            return r;
          });
          finalExp = finalExp.replace(/(答案.{0,3})[\(（]([A-E]{1,5})[\)）]/g, (m, pre, inner) => pre + '(' + remapSorted(inner) + ')');
          finalExp = finalExp.replace(/[\uE000-\uE004]/g, (ch) => String.fromCharCode(65 + ch.charCodeAt(0) - PH));
        }

        return {
          ...bq,
          title: nq.title,
          options: updatedOptions,
          answer: newAnswer,
          explanation: finalExp,
          imageUrl: nq.imageUrl || bq.imageUrl
        };
      });

      return {
        ...state,
        allQuestions: newAllQuestions,
        currentBatch: updatedBatch,
        errorLogs: errors
      };
    }

    case 'VIEW_MISTAKES':
      return { ...state, view: 'mistakes' };

    case 'RENAME_CATEGORY': {
      const { originalName, newName } = action.payload;
      const newCategoryNames = { ...state.categoryNames };
      if (!newName || newName.trim() === '') {
        delete newCategoryNames[originalName];
      } else {
        newCategoryNames[originalName] = newName.trim();
      }
      return { ...state, categoryNames: newCategoryNames, lastActionTime: Date.now() };
    }

    case 'RESET_QUESTION_STATS': {
      const title = action.payload;
      const newStats = { ...state.stats };
      newStats[title] = { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0, resetAt: Date.now() };
      return { ...state, stats: newStats, lastActionTime: Date.now() };
    }

    case 'START_QUIZ': {
      const { mode, qs } = action.payload;
      let newBatch = [];
      const qCount = state.questionsPerQuiz;

      if (mode === 'random') {
        newBatch = shuffleArray(qs).slice(0, qCount);
      } else if (mode === 'weighted50') {
        const newPool = [];
        const oldPool = [];
        qs.forEach(q => {
          const stat = state.stats[q.title];
          const attempts = stat ? (stat.totalCorrect + stat.totalWrong) : 0;
          const qWithStat = { ...q, stat };
          if (attempts === 0) {
            newPool.push(qWithStat);
          } else {
            oldPool.push(qWithStat);
          }
        });

        const targetNewCount = Math.round(qCount * 0.7);
        const shuffledNew = shuffleArray(newPool);
        const actualNewCount = Math.min(targetNewCount, shuffledNew.length);
        const selectedNew = shuffledNew.slice(0, actualNewCount);

        const remainingCount = qCount - actualNewCount;
        let selectedOld = [];
        if (remainingCount > 0) {
          selectedOld = getTopKWeighted(oldPool, remainingCount);
        }

        let combined = [...selectedNew, ...selectedOld];
        if (combined.length < qCount && shuffledNew.length > actualNewCount) {
          const extraNew = shuffledNew.slice(actualNewCount, actualNewCount + (qCount - combined.length));
          combined = [...combined, ...extraNew];
        }

        if (combined.length < qCount) {
          const existingTitles = new Set(combined.map(q => q.title));
          const remainderQs = qs.filter(q => !existingTitles.has(q.title));
          combined = [...combined, ...shuffleArray(remainderQs).slice(0, qCount - combined.length)];
        }

        newBatch = shuffleArray(combined).map(({ stat, ...rest }) => {
          const { tempId, ...cleanQ } = rest; // strip any temporary mapping fields if any
          return cleanQ;
        });
      } else if (mode === 'category') {
        const newPool = [];
        const oldPool = [];
        qs.forEach(q => {
          const stat = state.stats[q.title];
          const attempts = stat ? (stat.totalCorrect + stat.totalWrong) : 0;
          if (attempts === 0) newPool.push(q);
          else oldPool.push(q);
        });
        const targetNewCount = Math.round(qCount * 0.7);
        const shuffledNew = shuffleArray(newPool);
        const actualNewCount = Math.min(targetNewCount, shuffledNew.length);
        const selectedNew = shuffledNew.slice(0, actualNewCount);
        
        const remainingCount = qCount - actualNewCount;
        const selectedOld = shuffleArray(oldPool).slice(0, remainingCount);
        
        let combined = [...selectedNew, ...selectedOld];
        if (combined.length < qCount && shuffledNew.length > actualNewCount) {
          const extraNew = shuffledNew.slice(actualNewCount, actualNewCount + (qCount - combined.length));
          combined = [...combined, ...extraNew];
        }
        if (combined.length < qCount) {
          const existingTitles = new Set(combined.map(q => q.title));
          const remainderQs = qs.filter(q => !existingTitles.has(q.title));
          combined = [...combined, ...shuffleArray(remainderQs).slice(0, qCount - combined.length)];
        }
        newBatch = shuffleArray(combined);
      } else if (mode === 'mistakes') {
        const wrongQs = qs.filter(q => {
          const stat = state.stats[q.title];
          return stat && getSafeWeight(stat) > 100 && stat.totalWrong > stat.totalCorrect;
        });
        newBatch = shuffleArray(wrongQs).slice(0, qCount);
      } else {
        newBatch = [...qs];
      }

      return {
        ...state, mode, currentBatch: newBatch.map(q => state.shuffleOptions ? shuffleQuestionOptions(q) : q), userAnswers: Array(newBatch.length).fill(null), currentIndex: 0, score: 0, correctCount: 0, skippedCount: 0,
        view: 'quiz', selectedOption: null, hasAnswered: false,
        lastQuizCandidateTitles: qs.map(q => q.title),
        lastQuizMode: mode
      };
    }

    case 'RETURN_TO_MENU':
      return { ...state, view: 'menu', currentBatch: [], userAnswers: [], currentIndex: 0, score: 0, correctCount: 0, skippedCount: 0, selectedOption: null, hasAnswered: false };

    case 'SELECT_AND_CONFIRM': {
      if (state.hasAnswered) return state;
      const label = action.payload;
      const currentQ = state.currentBatch[state.currentIndex];
      const isCorrect = label === currentQ.answer;
      const prevStat = state.stats[currentQ.title] || { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0 };

      const newStats = {
        ...state.stats,
        [currentQ.title]: calculateNewStats(prevStat, isCorrect)
      };
      const newUserAnswers = [...state.userAnswers];
      newUserAnswers[state.currentIndex] = label;
      
      const points = isCorrect ? (state.scoringRules.correct ?? 1) : (state.scoringRules.wrong ?? 0);
      
      return { ...state, selectedOption: label, hasAnswered: true, score: state.score + points, correctCount: state.correctCount + (isCorrect ? 1 : 0), stats: newStats, userAnswers: newUserAnswers, lastActionTime: Date.now() };
    }

    case 'TOGGLE_OPTION': {
      if (state.hasAnswered) return state;
      const label = action.payload;
      const currentQ = state.currentBatch[state.currentIndex];
      const isMultiple = currentQ.answer.length > 1;

      let newSelected = state.selectedOption || '';
      if (isMultiple) {
        if (newSelected.includes(label)) {
          newSelected = newSelected.replace(label, '');
        } else {
          newSelected = newSelected + label;
        }
        newSelected = newSelected.split('').sort().join('');
      } else {
        newSelected = newSelected === label ? '' : label;
      }
      return { ...state, selectedOption: newSelected || null };
    }

    case 'TOGGLE_OPTION_BY_INDEX': {
      if (state.view !== 'quiz' || state.hasAnswered) return state;
      const currentQ = state.currentBatch[state.currentIndex];
      if (!currentQ || !currentQ.options[action.payload]) return state;

      const label = currentQ.options[action.payload].label;
      const isMultiple = currentQ.answer.length > 1;

      let newSelected = state.selectedOption || '';
      if (isMultiple) {
        if (newSelected.includes(label)) {
          newSelected = newSelected.replace(label, '');
        } else {
          newSelected = newSelected + label;
        }
        newSelected = newSelected.split('').sort().join('');
      } else {
        newSelected = newSelected === label ? '' : label;
      }
      return { ...state, selectedOption: newSelected || null };
    }

    case 'CONFIRM_ANSWER': {
      if (state.hasAnswered || !state.selectedOption) return state;
      const label = state.selectedOption;
      const currentQ = state.currentBatch[state.currentIndex];
      const isCorrect = label === currentQ.answer;
      const prevStat = state.stats[currentQ.title] || { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0 };

      const newStats = {
        ...state.stats,
        [currentQ.title]: calculateNewStats(prevStat, isCorrect)
      };
      const newUserAnswers = [...state.userAnswers];
      newUserAnswers[state.currentIndex] = label;
      
      const points = isCorrect ? (state.scoringRules.correct ?? 1) : (state.scoringRules.wrong ?? 0);
      
      return { ...state, hasAnswered: true, score: state.score + points, correctCount: state.correctCount + (isCorrect ? 1 : 0), stats: newStats, userAnswers: newUserAnswers, lastActionTime: Date.now() };
    }

    case 'SKIP_QUESTION': {
      if (state.hasAnswered) return state;
      const currentQ = state.currentBatch[state.currentIndex];
      const prevStat = state.stats[currentQ.title] || { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0 };
      const newStats = {
        ...state.stats,
        [currentQ.title]: calculateNewStats(prevStat, false)
      };
      const newUserAnswers = [...state.userAnswers];
      newUserAnswers[state.currentIndex] = 'skipped';
      
      const points = state.scoringRules.skipped ?? 0;
      
      return {
        ...state,
        selectedOption: 'skipped',
        hasAnswered: true,
        score: state.score + points,
        skippedCount: state.skippedCount + 1,
        stats: newStats,
        userAnswers: newUserAnswers,
        lastActionTime: Date.now()
      };
    }

    case 'NEXT_QUESTION':
      if (!state.hasAnswered) return state;
      if (state.currentIndex < state.currentBatch.length - 1) {
        const nextIdx = state.currentIndex + 1;
        const nextAnswered = state.userAnswers[nextIdx] !== null;
        return {
          ...state,
          currentIndex: nextIdx,
          selectedOption: state.userAnswers[nextIdx],
          hasAnswered: nextAnswered
        };
      }
      return { ...state, view: 'result' };

    case 'GOTO_QUESTION': {
      const idx = action.payload;
      if (idx < 0 || idx >= state.currentBatch.length) return state;
      const nextAnswered = state.userAnswers[idx] !== null;
      return {
        ...state,
        currentIndex: idx,
        selectedOption: state.userAnswers[idx],
        hasAnswered: nextAnswered
      };
    }

    case 'RESET_STATS': {
      const resetAllStats = {};
      const now = Date.now();
      for (const key of Object.keys(state.stats)) {
        resetAllStats[key] = { totalCorrect: 0, totalWrong: 0, currentWeight: 100, streak: 0, resetAt: now };
      }
      return { ...state, stats: resetAllStats, lastActionTime: Date.now() };
    }

    case 'CLOSE_SYNC_MODAL':
      return { ...state, lastActionTime: Date.now() };

    case 'SET_QUESTIONS_PER_QUIZ':
      return { ...state, questionsPerQuiz: action.payload };

    case 'IMPORT_STATS':
      return { ...state, stats: action.payload };
    case 'CLEAR_ALL':
      return getInitialState();
    case 'DELETE_CATEGORIES': {
      const categoriesToDelete = action.payload;
      const newAllQuestions = state.allQuestions.filter(q => {
        const match = q.title.match(/^\[([A-Za-z]+\d{2})/);
        const cat = match ? match[1] : '其他';
        return !categoriesToDelete.includes(cat);
      });
      const newStats = { ...state.stats };
      const deletedTitles = new Set(state.allQuestions.filter(q => {
        const match = q.title.match(/^\[([A-Za-z]+\d{2})/);
        const cat = match ? match[1] : '其他';
        return categoriesToDelete.includes(cat);
      }).map(q => q.title));
      deletedTitles.forEach(t => {
        delete newStats[t];
      });
      return {
        ...state,
        allQuestions: newAllQuestions,
        stats: newStats,
        lastActionTime: Date.now()
      };
    }
    case 'CLOUD_SYNC_PULL': {
      const { questions, stats } = action.payload;
      const newQ = questions && questions.length > 0 ? mergeWithBuiltins(questions) : state.allQuestions;
      return { ...state, allQuestions: newQ, stats: stats, view: newQ.length > 0 && state.view === 'upload' ? 'menu' : state.view };
    }
    case 'UPDATE_SCORING_RULES':
      return { ...state, scoringRules: { ...state.scoringRules, ...action.payload }, lastActionTime: Date.now() };
    case 'TOGGLE_SHUFFLE_OPTIONS':
      return { ...state, shuffleOptions: !state.shuffleOptions, lastActionTime: Date.now() };
    default: return state;
  }
};


