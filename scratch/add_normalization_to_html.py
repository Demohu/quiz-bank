import os
import re

def add_normalization(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return False
        
    print(f"Adding character normalization to: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # 1. Insert helper functions
    target_banner = '// =====================================================================\n    const BUILTIN_QUESTIONS = [];'
    has_cr = '\r' in html
    if has_cr:
        target_banner = target_banner.replace('\n', '\r\n')
        
    if target_banner not in html:
        # Try variation
        target_banner = '// =====================================================================\r\n    const BUILTIN_QUESTIONS = [];'
    if target_banner not in html:
        target_banner = '// =====================================================================\n    const BUILTIN_QUESTIONS = [];'
        
    if target_banner not in html:
        print(f"Could not find insert point for helpers in {path}")
        return False
        
    helpers_code = """// =====================================================================
    const SPECIAL_MAPPING = {
      '\\u2ec4': '西',
      '\\u2ed1': '長',
    };
    const normalizeText = (str) => {
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

    const normalizeStats = (stats) => {
      if (!stats) return {};
      const normalized = {};
      Object.keys(stats).forEach(key => {
        normalized[normalizeText(key)] = stats[key];
      });
      return normalized;
    };

    const BUILTIN_QUESTIONS = [];"""
    
    if has_cr:
        helpers_code = helpers_code.replace('\n', '\r\n')
        
    html = html.replace(target_banner, helpers_code)
    
    # 2. Update initialState
    old_init = "stats: JSON.parse(localStorage.getItem('anki_stats')) || {},"
    new_init = "stats: normalizeStats(JSON.parse(localStorage.getItem('anki_stats')) || {}),"
    html = html.replace(old_init, new_init)
    html = html.replace(old_init.replace('\n', '\r\n'), new_init.replace('\n', '\r\n'))
    
    # 3. Update lwwMerge
    old_lww = """      const lwwMerge = (localStats, cloudStats) => {
        const allKeys = new Set([...Object.keys(localStats || {}), ...Object.keys(cloudStats || {})]);
        const merged = {};
        for (const key of allKeys) {
          const local = (localStats || {})[key];
          const cloud = (cloudStats || {})[key];"""
          
    new_lww = """      const lwwMerge = (localStats, cloudStats) => {
        const normLocal = normalizeStats(localStats);
        const normCloud = normalizeStats(cloudStats);
        const allKeys = new Set([...Object.keys(normLocal || {}), ...Object.keys(normCloud || {})]);
        const merged = {};
        for (const key of allKeys) {
          const local = (normLocal || {})[key];
          const cloud = (normCloud || {})[key];"""
          
    html = html.replace(old_lww, new_lww)
    html = html.replace(old_lww.replace('\n', '\r\n'), new_lww.replace('\n', '\r\n'))
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"Successfully updated {path}!")
    return True

modify_1 = add_normalization('C:/Users/liawb/OneDrive/Desktop/題庫/index.html')
modify_2 = add_normalization('C:/Users/liawb/OneDrive/Desktop/題庫/index_new.html')
print("Complete.")
