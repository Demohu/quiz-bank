// --- 演算法 ---
export const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const shuffleQuestionOptions = (q) => {
  if (!q || !q.options || q.options.length < 2) return q;

  // 不隨機打亂特定的圖表題，以確保選項代號與附圖的 A/B/C/D 項目對齊
  const qCodeMatch = q.title.match(/^\[(EB\d+)\]/);
  const qCode = qCodeMatch ? qCodeMatch[1] : '';
  const NO_SHUFFLE_CODES = ['EB020019', 'EB020098', 'EB020101', 'EB030072'];
  if (NO_SHUFFLE_CODES.includes(qCode)) {
    return q;
  }

  const correctLabels = new Set(q.answer.split(''));
  const shuffledOptions = shuffleArray(q.options);
  const isNumeric = /^\d+$/.test(q.options[0].label);
  const newAnswerLabels = [];

  // Build old→new label mapping
  const labelMap = {}; // e.g. { A: 'C', B: 'A', C: 'D', D: 'B' }
  const finalOptions = shuffledOptions.map((opt, idx) => {
    const newLabel = isNumeric ? (idx + 1).toString() : String.fromCharCode(65 + idx);
    if (correctLabels.has(opt.label)) {
      newAnswerLabels.push(newLabel);
    }
    labelMap[opt.label] = newLabel;
    return {
      ...opt,
      label: newLabel,
      originalLabel: opt.label
    };
  });
  const newAnswer = newAnswerLabels.sort().join('');

  // Rewrite explanation using precise regex + placeholder tokens
  let finalExp = q.explanation;
  const hasChange = Object.keys(labelMap).some(k => k !== labelMap[k]);
  
  // If options are pure permutations of A-E (sequence questions), (A) in explanation refers to items, not options.
  const isSequenceQuestion = q.options.every(opt => /^[A-Ea-e\s,、，]+$/.test(opt.text || ''));

  if (hasChange && finalExp && finalExp.trim() && !isSequenceQuestion) {
    // Use Unicode Private Use Area chars as temporary placeholders
    // to prevent double-replacement (e.g. A→C then C→D chaining)
    const PH = 0xE000; // \uE000-\uE004 map to A-E
    const toP = (ch) => String.fromCharCode(PH + (labelMap[ch] || ch).charCodeAt(0) - 65);
    const remapSorted = (s) => {
      const mapped = s.split('').map(ch => labelMap[ch] || ch).sort();
      return mapped.map(ch => String.fromCharCode(PH + ch.charCodeAt(0) - 65)).join('');
    };

    // 1. (A), (AB), (ABC) — pure A-E labels only
    //    (?![a-z]) prevents matching (Attention), (Apply), (SaaS) etc.
    finalExp = finalExp.replace(/\(([A-E]{1,5})\)(?![a-z])/g, (m, inner) =>
      '(' + remapSorted(inner) + ')');

    // 2. 選項(A) or 選項（A）
    finalExp = finalExp.replace(/選項\s*[\(（]([A-E])[\)）]/g, (m, lbl) =>
      '選項(' + toP(lbl) + ')');

    // 3. 選項A (no parens) — also captures trailing 與/及/和/或 + label
    finalExp = finalExp.replace(/選項\s*([A-E])(?![a-zA-Z])((?:\s*[與及和或、]\s*([A-E])(?![a-zA-Z]))*)/g,
      (m, lbl, rest) => {
        let r = '選項' + toP(lbl);
        if (rest) r += rest.replace(/([A-E])(?![a-zA-Z])/g, (m2, l2) => toP(l2));
        return r;
      });

    // 4. 答案...(X) or 答案...(ABC)
    finalExp = finalExp.replace(/(答案.{0,3})[\(（]([A-E]{1,5})[\)）]/g, (m, pre, inner) =>
      pre + '(' + remapSorted(inner) + ')');

    // Final pass: convert all placeholders back to real A-E labels
    finalExp = finalExp.replace(/[\uE000-\uE004]/g, (ch) =>
      String.fromCharCode(65 + ch.charCodeAt(0) - PH));
  }

  return {
    ...q,
    options: finalOptions,
    answer: newAnswer,
    explanation: finalExp
  };
};


// 取得當前權重 (相容舊有紀錄的防呆處理)
export const getSafeWeight = (stat) => {
  if (!stat) return 100;
  if (stat.currentWeight !== undefined) return stat.currentWeight;
  return 100;
};

// ✅ 修正2：抽樣時的有效權重上限。
// 原本 weight 可達 500，導致高懲罰題的抽中機率遠高於新題 (weight=100)，
// 使新題幾乎永遠進不了 50 題名額。上限設 250 後，最高懲罰題對新題的
// 勝率從 ~83% 降至 ~71%，仍優先複習錯題，但新題也有合理機會出現。
export const SAMPLE_WEIGHT_CAP = 250;

// O(N log N) A-Res Algorithm
export const getTopKWeighted = (items, k) => {
  return items
    .map(item => {
      // ✅ 修正2：套用抽樣上限，防止超高懲罰題壟斷名額
      const effectiveW = Math.min(getSafeWeight(item.stat), SAMPLE_WEIGHT_CAP);
      return { item, score: Math.pow(Math.random(), 1 / effectiveW) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(x => x.item);
};

// 計算新權重與連勝 (SM-2 啟發)
export const calculateNewStats = (prevStat, isCorrect) => {
  const currentW = getSafeWeight(prevStat);
  const currentStreak = prevStat.streak || 0;

  let newWeight = currentW;
  let newStreak = currentStreak;

  if (isCorrect) {
    // ✅ 修正3：streak 上限設為 10，避免無意義的無限累積
    newStreak = Math.min(currentStreak + 1, 10);

    // ✅ 修正1：改用 newStreak（答對後的連勝數）判斷衰減乘數。
    // 原本用 currentStreak（答前）導致每個乘數都「晚一次」觸發，
    // 例如連勝達 4 次時應套用 0.22，原本要到第 5 次才觸發。
    // 連勝衰減矩陣：streak 越高代表越熟練，降權越激進
    let decayMultiplier;
    if      (newStreak === 1) decayMultiplier = 0.60; // 第 1 次答對：輕衰減
    else if (newStreak === 2) decayMultiplier = 0.50;
    else if (newStreak === 3) decayMultiplier = 0.40;
    else if (newStreak === 4) decayMultiplier = 0.30;
    else                      decayMultiplier = 0.22; // 連勝 5 次以上：強力衰減

    // 精通題下限為 5
    newWeight = Math.max(5, currentW * decayMultiplier);
  } else {
    newStreak = 0;

    // ✅ 修正4（說明）：penaltyMultiplier 與下限 120 互相依賴。
    // 當 currentW 很低（精通題 weight=5），乘以 2.0 或 3.5 結果仍遠低於 120，
    // 完全靠 Math.max(120, ...) 保底。若未來調整下限值，乘數也需一併檢視。
    // 處罰矩陣：連勝 3 以上破功，處罰加重
    const penaltyMultiplier = currentStreak >= 3 ? 3.5 : 2.0;

    // 答錯一律保底回升至 120，確保被遺忘的精通題重新進入高頻區
    newWeight = Math.max(120, Math.min(500, currentW * penaltyMultiplier));
  }

  return {
    totalCorrect: prevStat.totalCorrect + (isCorrect ? 1 : 0),
    totalWrong:   prevStat.totalWrong   + (isCorrect ? 0 : 1),
    currentWeight: newWeight,
    streak: newStreak,
    lastAnswered: Date.now()
  };
};
