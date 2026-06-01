import React, { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { reducer, getInitialState } from './state/quizReducer';
import { useGistSync } from './hooks/useGistSync';
import { BUILTIN_QUESTIONS } from './utils/questionParser';

import UploadView from './views/UploadView';
import MenuView from './views/MenuView';
import QuizView from './views/QuizView';
import ResultView from './views/ResultView';
import MistakesView from './views/MistakesView';
import SyncModal from './components/SyncModal';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);
  const fileInputRef = useRef(null);
  const quizFileInputRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [sortBy, setSortBy] = useState('wrongCount');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleRestartQuiz = useCallback(() => {
    const candidateTitles = state.lastQuizCandidateTitles || [];
    const candidateQs = state.allQuestions.filter(q => candidateTitles.includes(q.title));
    const qs = candidateQs.length > 0 ? candidateQs : state.allQuestions;
    dispatch({ type: 'START_QUIZ', payload: { mode: state.lastQuizMode || 'weighted50', qs } });
  }, [state.allQuestions, state.lastQuizCandidateTitles, state.lastQuizMode, dispatch]);

  // Sync logic
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const syncProps = useGistSync(stateRef, dispatch);

  // Storage persistence
  useEffect(() => {
    localStorage.setItem('anki_view', state.view);
    const builtinTitles = new Set(BUILTIN_QUESTIONS.map(q => q.title));
    const txtOnly = state.allQuestions.filter(q => !builtinTitles.has(q.title));
    localStorage.setItem('anki_all_questions', JSON.stringify(txtOnly));
    localStorage.setItem('anki_batch', JSON.stringify(state.currentBatch));
    localStorage.setItem('anki_index', state.currentIndex.toString());
    localStorage.setItem('anki_score', state.score.toString());
    localStorage.setItem('anki_correct_count', state.correctCount.toString());
    localStorage.setItem('anki_skipped_count', (state.skippedCount || 0).toString());
    localStorage.setItem('anki_last_quiz_candidate_titles', JSON.stringify(state.lastQuizCandidateTitles || []));
    localStorage.setItem('anki_last_quiz_mode', state.lastQuizMode || 'weighted50');
    localStorage.setItem('anki_mode', state.mode);
    localStorage.setItem('anki_stats', JSON.stringify(state.stats));
    localStorage.setItem('anki_stats_snapshot', JSON.stringify(state.statsSnapshot));
    localStorage.setItem('anki_questions_per_quiz', state.questionsPerQuiz.toString());
    localStorage.setItem('anki_has_answered', state.hasAnswered.toString());
    localStorage.setItem('anki_selected_option', state.selectedOption || '');
    localStorage.setItem('anki_user_answers', JSON.stringify(state.userAnswers || []));
    localStorage.setItem('anki_category_names', JSON.stringify(state.categoryNames || {}));
    localStorage.setItem('anki_shuffle_options', state.shuffleOptions.toString());
    localStorage.setItem('anki_scoring_rules', JSON.stringify(state.scoringRules || { correct: 2, wrong: -0.5, skip: 0 }));
  }, [state]);

  // Auto-advance
  useEffect(() => {
    if (state.view === 'quiz' && state.hasAnswered) {
      const currentQ = state.currentBatch[state.currentIndex];
      if (state.selectedOption === currentQ.answer) {
        const timer = setTimeout(() => {
          dispatch({ type: 'NEXT_QUESTION' });
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [state.view, state.hasAnswered, state.selectedOption, state.currentIndex, state.currentBatch]);

  // Auto-advance for single option correct answer
  useEffect(() => {
    if (state.view !== 'quiz' || !state.hasAnswered) return;
    const currentQ = state.currentBatch[state.currentIndex];
    if (!currentQ) return;
    const isMultiple = currentQ.answer.length > 1;
    const isCorrect = state.selectedOption === currentQ.answer;
    if (!isMultiple && isCorrect) {
      const timer = setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.view, state.hasAnswered, state.selectedOption, state.currentIndex, state.currentBatch]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (state.view !== 'quiz' && state.view !== 'result') return;
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (state.view === 'result') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          handleRestartQuiz();
        }
        return;
      }

      const currentQ = state.currentBatch[state.currentIndex];
      if (!currentQ) return;
      const isMultiple = currentQ.answer.length > 1;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (!state.hasAnswered) {
          if (state.selectedOption) {
            dispatch({ type: 'CONFIRM_ANSWER' });
          }
        } else {
          dispatch({ type: 'NEXT_QUESTION' });
        }
      } else if (e.code === 'Escape' || e.key.toLowerCase() === 'q' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (!state.hasAnswered) {
          dispatch({ type: 'SKIP_QUESTION' });
        }
      } else {
        const key = e.key.toLowerCase();
        const keyMap = { 'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 4 };
        const optionIdx = keyMap[key];
        if (optionIdx !== undefined) {
          if (state.hasAnswered) return;
          const option = currentQ.options[optionIdx];
          if (!option) return;

          if (isMultiple) {
            dispatch({ type: 'TOGGLE_OPTION', payload: option.label });
          } else {
            dispatch({ type: 'SELECT_AND_CONFIRM', payload: option.label });
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.view, state.hasAnswered, state.selectedOption, state.currentIndex, state.currentBatch, handleRestartQuiz]);

  // Context menu prevention
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (isMobile) return;
      if (state.view !== 'quiz' && state.view !== 'result') return;
      if (syncProps.showSyncModal) return;
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      e.preventDefault();
      if (state.view === 'result') {
        handleRestartQuiz();
      } else {
        if (!state.hasAnswered) {
          if (state.selectedOption) {
            dispatch({ type: 'CONFIRM_ANSWER' });
          }
        } else {
          dispatch({ type: 'NEXT_QUESTION' });
        }
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [isMobile, state.view, state.hasAnswered, state.selectedOption, syncProps.showSyncModal, handleRestartQuiz]);

  const handleReturnMenu = () => {
    if (window.confirm("確定要中斷測驗回到主選單嗎？（已作答的題目進度將會保留並自動同步）")) {
      dispatch({ type: 'RETURN_TO_MENU' });
    }
  };

  const handleQuizUpdateClick = () => {
    if (quizFileInputRef.current) {
      quizFileInputRef.current.click();
    }
  };

  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    import('./utils/questionParser.js').then(({ parseImportedData }) => {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const { parsedQuestions, errors } = parseImportedData(file, ev.target.result);
            resolve({ parsedQuestions, errors });
          };
          reader.readAsText(file);
        });
      });
      Promise.all(promises).then(results => {
        let allParsedQuestions = [];
        let allErrors = [];
        results.forEach(res => {
          allParsedQuestions = allParsedQuestions.concat(res.parsedQuestions);
          allErrors = allErrors.concat(res.errors);
        });
        if (allParsedQuestions.length > 0) {
          dispatch({ type: 'LOAD_DATA', payload: { parsedQuestions: allParsedQuestions, errors: allErrors } });
        } else {
          alert(allErrors.join('\n') || "解析失敗，找不到符合格式的題目。");
        }
      });
    });
  }, [dispatch]);

  const handleQuizFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    import('./utils/questionParser.js').then(({ parseImportedData }) => {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const { parsedQuestions, errors } = parseImportedData(file, ev.target.result);
            resolve({ parsedQuestions, errors });
          };
          reader.readAsText(file);
        });
      });
      Promise.all(promises).then(results => {
        let allParsedQuestions = [];
        let allErrors = [];
        results.forEach(res => {
          allParsedQuestions = allParsedQuestions.concat(res.parsedQuestions);
          allErrors = allErrors.concat(res.errors);
        });
        if (allParsedQuestions.length > 0) {
          dispatch({ type: 'UPDATE_QUESTIONS_MID_QUIZ', payload: { parsedQuestions: allParsedQuestions, errors: allErrors } });
          alert("題庫更新成功！當前做題批次已同步更新，答題進度完美保留！");
        } else {
          alert(allErrors.join('\n') || "解析失敗，找不到符合格式的題目。");
        }
      });
    });
  };

  const renderSyncModal = () => (
    <SyncModal isMobile={isMobile} {...syncProps} />
  );

  let content;
  switch (state.view) {
    case 'upload':
      content = (
        <UploadView 
          state={state} 
          dispatch={dispatch} 
          fileInputRef={fileInputRef} 
          isMobile={isMobile} 
          onShowSyncModal={() => syncProps.setShowSyncModal(true)} 
          renderSyncModal={renderSyncModal} 
        />
      );
      break;
    case 'menu':
      content = (
        <MenuView 
          state={state} 
          dispatch={dispatch} 
          isMobile={isMobile} 
          fileInputRef={fileInputRef} 
          handleFileUpload={handleFileUpload}
          setShowSyncModal={syncProps.setShowSyncModal} 
          autoSync={syncProps.autoSync} 
          syncGistId={syncProps.syncGistId} 
          renderSyncModal={renderSyncModal} 
        />
      );
      break;
    case 'quiz':
      content = (
        <QuizView 
          state={state} 
          dispatch={dispatch} 
          isMobile={isMobile} 
          quizFileInputRef={quizFileInputRef} 
          handleQuizFileUpload={handleQuizFileUpload} 
          handleReturnMenu={handleReturnMenu} 
          handleQuizUpdateClick={handleQuizUpdateClick} 
        />
      );
      break;
    case 'result':
      content = (
        <ResultView 
          state={state} 
          isMobile={isMobile} 
          onRestartQuiz={handleRestartQuiz} 
          dispatch={dispatch} 
        />
      );
      break;
    case 'mistakes':
      content = (
        <MistakesView 
          state={state} 
          dispatch={dispatch} 
          isMobile={isMobile} 
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      );
      break;
    default:
      content = null;
  }

  return content;
}
