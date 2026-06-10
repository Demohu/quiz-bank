import os
import re

file_path = r"c:\Users\liawb\OneDrive\Desktop\題庫\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace handleFileUpload
old_handle = """      const handleFileUpload = (e) => {
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

new_handle = """      const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        let allParsed = [];
        let allErrors = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const text = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsText(file);
          });
          const { parsedQuestions, errors } = parseImportedData(file, text);
          if (parsedQuestions) allParsed = allParsed.concat(parsedQuestions);
          if (errors) allErrors = allErrors.concat(errors);
        }
        
        if (allParsed.length > 0) {
          let finalQuestions = allParsed;
          if (state.allQuestions && state.allQuestions.length > 0) {
            const append = window.confirm("您已經載入了題庫。要將新題目【附加】到現有題庫中嗎？\\n\\n按「確定」附加，按「取消」則取代舊題庫。");
            if (append) {
              finalQuestions = [...state.allQuestions, ...allParsed];
            }
          }
          // 去除重複題號
          const uniqueQuestions = Array.from(new Map(finalQuestions.map(q => [q.title, q])).values());
          dispatch({ type: 'LOAD_DATA', payload: { parsedQuestions: uniqueQuestions, errors: allErrors } });
        } else {
          alert(allErrors.join('\\n') || "解析失敗，找不到符合格式的題目。");
        }
        e.target.value = null; // 重置 input 以允許重複選擇相同檔案
      };"""

if old_handle in content:
    content = content.replace(old_handle, new_handle)
    print("handleFileUpload replaced successfully.")
else:
    print("Could not find old handleFileUpload.")

# Replace <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>
old_input1 = '<input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>'
new_input1 = '<input type="file" accept=".json" multiple onChange={handleFileUpload} className="hidden" ref={fileInputRef}/>'

if old_input1 in content:
    content = content.replace(old_input1, new_input1)
    print("Replaced old_input1")
else:
    print("Could not find old_input1")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done.")
