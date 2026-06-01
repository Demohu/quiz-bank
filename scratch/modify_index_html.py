import os
import re

def modify_html_file(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return False
        
    print(f"Modifying: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # 1. Define parseImportedData right before handleFileUpload
    target_pattern = 'return { parsedQuestions, errors };\n      };\n\n      const handleFileUpload'
    if target_pattern not in html:
        target_pattern = 'return { parsedQuestions, errors };\r\n      };\r\n\r\n      const handleFileUpload'
        
    if target_pattern not in html:
        print(f"Could not find insert point in {path}")
        return False
        
    parse_imported_data_code = """return { parsedQuestions, errors };
      };

      const parseImportedData = (file, text) => {
        if (file.name.endsWith('.json') || text.trim().startsWith('[') || text.trim().startsWith('{')) {
          try {
            const data = JSON.parse(text);
            const parsedQuestions = Array.isArray(data) ? data : [data];
            const validQuestions = parsedQuestions.filter(q => q && q.title && q.options && q.answer !== undefined);
            if (validQuestions.length === 0) {
              return { parsedQuestions: [], errors: ["JSON 檔案中沒有找到有效的題目資料結構"] };
            }
            return { parsedQuestions: validQuestions, errors: [] };
          } catch (err) {
            return { parsedQuestions: [], errors: ["JSON 檔案解析出錯：" + err.message] };
          }
        }
        return parseData(text);
      };

      const handleFileUpload"""
      
    html = html.replace(target_pattern, parse_imported_data_code)
    
    # 2. Replace handleFileUpload body
    old_handle_file_upload = """const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const { parsedQuestions, errors } = parseData(ev.target.result);
          if (parsedQuestions.length > 0) dispatch({ type: 'LOAD_DATA', payload: { parsedQuestions, errors } });
          else alert("解析失敗，找不到符合格式的題目。");
        };
        reader.readAsText(file);
      };"""
      
    new_handle_file_upload = """const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const { parsedQuestions, errors } = parseImportedData(file, ev.target.result);
          if (parsedQuestions.length > 0) dispatch({ type: 'LOAD_DATA', payload: { parsedQuestions, errors } });
          else alert(errors.join('\\n') || "解析失敗，找不到符合格式的題目。");
        };
        reader.readAsText(file);
      };"""
      
    html = html.replace(old_handle_file_upload, new_handle_file_upload)
    html = html.replace(old_handle_file_upload.replace('\n', '\r\n'), new_handle_file_upload.replace('\n', '\r\n'))
    
    # 3. Replace handleQuizFileUpload body
    old_handle_quiz_file_upload = """const handleQuizFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const { parsedQuestions, errors } = parseData(ev.target.result);
          if (parsedQuestions.length > 0) {
            dispatch({ type: 'UPDATE_QUESTIONS_MID_QUIZ', payload: { parsedQuestions, errors } });
            alert("題庫更新成功！當前做題批次已同步更新，答題進度完美保留！");
          } else {
            alert("解析失敗，找不到符合格式的題目。");
          }
        };
        reader.readAsText(file);
      };"""
      
    new_handle_quiz_file_upload = """const handleQuizFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const { parsedQuestions, errors } = parseImportedData(file, ev.target.result);
          if (parsedQuestions.length > 0) {
            dispatch({ type: 'UPDATE_QUESTIONS_MID_QUIZ', payload: { parsedQuestions, errors } });
            alert("題庫更新成功！當前做題批次已同步更新，答題進度完美保留！");
          } else {
            alert(errors.join('\\n') || "解析失敗，找不到符合格式的題目。");
          }
        };
        reader.readAsText(file);
      };"""
      
    if old_handle_quiz_file_upload not in html and old_handle_quiz_file_upload.replace('\n', '\r\n') not in html:
        html, count = re.subn(
            r'const handleQuizFileUpload = \(e\) => \{(.*?)\};\s*(?=(const handleResetStats|const handleExportStats))',
            lambda m: """const handleQuizFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const { parsedQuestions, errors } = parseImportedData(file, ev.target.result);
          if (parsedQuestions.length > 0) {
            dispatch({ type: 'UPDATE_QUESTIONS_MID_QUIZ', payload: { parsedQuestions, errors } });
            alert("題庫更新成功！當前做題批次已同步更新，答題進度完美保留！");
          } else {
            alert(errors.join('\\n') || "解析失敗，找不到符合格式的題目。");
          }
        };
        reader.readAsText(file);
      };""" + ('\r\n\r\n      ' if '\r' in m.group(0) else '\n\n      '),
            html,
            flags=re.DOTALL
        )
        print(f"Replaced handleQuizFileUpload using regex: {count} times")
    else:
        html = html.replace(old_handle_quiz_file_upload, new_handle_quiz_file_upload)
        html = html.replace(old_handle_quiz_file_upload.replace('\n', '\r\n'), new_handle_quiz_file_upload.replace('\n', '\r\n'))
        print("Replaced handleQuizFileUpload using direct string replace")

    # 4. Replace accept=".txt" with accept=".txt,.json"
    html, count_accept = re.subn(r'accept="\.txt"', 'accept=".txt,.json"', html)
    print(f"Updated accept attribute: {count_accept} times")
    
    # 5. Replace text description "請上傳您的 Anki 匯出檔 (TXT)" with "請上傳您的 Anki 匯出檔 (TXT 或 JSON)"
    html, count_desc = re.subn(r'請上傳您的 Anki 匯出檔 \(TXT\)', '請上傳您的 Anki 匯出檔 (TXT 或 JSON)', html)
    print(f"Updated description text: {count_desc} times")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    return True

# Re-read files to ensure clean start in case of partial modifications
modify_html_file('C:/Users/liawb/OneDrive/Desktop/題庫/index.html')
modify_html_file('C:/Users/liawb/OneDrive/Desktop/題庫/index_new.html')
print("Modification of HTML files completed.")
