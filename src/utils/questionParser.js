export const SPECIAL_MAPPING = {
  '\u2ec4': '西',
  '\u2ed1': '長',
};

export const normalizeText = (str) => {
  if (!str) return str;
  let result = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (SPECIAL_MAPPING[char]) {
      result.push(SPECIAL_MAPPING[char]);
    } else {
      result.push(char);
    }
  }
  return result.join('').normalize('NFKC');
};

export const normalizeStats = (stats) => {
  if (!stats) return {};
  const normalized = {};
  Object.keys(stats).forEach(key => {
    normalized[normalizeText(key)] = stats[key];
  });
  return normalized;
};

export const BUILTIN_QUESTIONS = [];

// 將 BUILTIN_QUESTIONS 合併到題庫（依題號排序，不重複）
export const mergeWithBuiltins = (txtQuestions) => {
  const builtinTitles = new Set(BUILTIN_QUESTIONS.map(q => q.title));
  // 過濾掉 TXT 中可能重複的題目（以 title 為準）
  const filtered = txtQuestions.filter(q => !builtinTitles.has(q.title));
  const merged = [...filtered, ...BUILTIN_QUESTIONS];
  // 依題號排序（題目開頭若有數字則按數字排）
  merged.sort((a, b) => {
    const numA = parseInt(a.title.match(/^(\d+)/)?.[1] || '9999');
    const numB = parseInt(b.title.match(/^(\d+)/)?.[1] || '9999');
    return numA - numB;
  });
  return merged;
};

export const parseImportedData = (file, text) => {
  try {
    const data = JSON.parse(text);
    const parsedQuestions = Array.isArray(data) ? data : [data];
    const validQuestions = parsedQuestions.filter(q => q && q.title && q.options && q.answer !== undefined);
    if (validQuestions.length === 0) {
      return { parsedQuestions: [], errors: ["JSON 檔案中沒有找到有效的題目資料結構。"] };
    }
    // Normalize titles during import to match stats in localStorage
    const normalizedQuestions = validQuestions.map(q => ({
      ...q,
      title: normalizeText(q.title)
    }));
    return { parsedQuestions: normalizedQuestions, errors: [] };
  } catch (err) {
    return { parsedQuestions: [], errors: ["JSON 檔案解析失敗：" + err.message] };
  }
};
