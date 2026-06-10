import os
import json
import random
import subprocess
import shutil
from pathlib import Path

WORKSPACE = r"C:\Users\liawb\OneDrive\Desktop\題庫"
OUTPUT_DIR = os.path.join(WORKSPACE, "題庫隨機版_PDF")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Create output folder
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load questions
questions_file = os.path.join(WORKSPACE, "questions.json")
if not os.path.exists(questions_file):
    print("找不到 questions.json 檔案")
    exit(1)

with open(questions_file, 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"載入題庫，共 {len(questions)} 題。")

# CSS style for printing
HTML_TEMPLATE_START = """<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>統計學題庫隨機版 - {version_title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #1a202c;
            line-height: 1.5;
            padding: 40px;
            font-size: 14px;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 5px;
            color: #1a202c;
        }
        .subtitle {
            text-align: center;
            font-size: 12px;
            color: #718096;
            margin-bottom: 40px;
            font-weight: bold;
        }
        .question-card {
            page-break-inside: avoid;
            margin-bottom: 24px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 20px;
        }
        .question-header {
            font-weight: bold;
            font-size: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }
        .question-title {
            flex-grow: 1;
        }
        .question-id {
            font-size: 11px;
            font-family: monospace;
            color: #a0aec0;
            margin-left: 10px;
            white-space: nowrap;
        }
        .options-list {
            margin-left: 15px;
            margin-bottom: 12px;
        }
        .option-item {
            margin-top: 4px;
        }
        .answer-section {
            background-color: #f7fafc;
            border-left: 3px solid #cbd5e0;
            padding: 8px 12px;
            margin-top: 10px;
            font-size: 13px;
        }
        .answer-row {
            font-weight: bold;
            color: #2b6cb0;
        }
        .explanation-row {
            margin-top: 4px;
            color: #4a5568;
        }
        .question-image {
            max-height: 220px;
            display: block;
            margin: 10px 0;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <h1>統計學考試題庫</h1>
    <div class="subtitle">{version_title} | 共 300 題 | 附正確答案與解析</div>
"""

HTML_TEMPLATE_END = """
</body>
</html>
"""

for i in range(1, 6):
    year = 2026 - (i - 1)
    version_title = f"{year}年版"
    print(f"正在生成 {version_title}...")
    
    # Shuffle question copy
    shuffled_qs = list(questions)
    random.shuffle(shuffled_qs)
    
    # Generate HTML content
    html_content = HTML_TEMPLATE_START.replace("{version_title}", version_title)
    
    for idx, q in enumerate(shuffled_qs):
        title_raw = q.get('title', '')
        
        # Parse title and ID [EB...]
        import re
        id_match = re.match(r'^(\[[A-Za-z0-9_-]+\])(.*)', title_raw, re.DOTALL)
        if id_match:
            q_id = id_match.group(1)
            q_title = id_match.group(2).strip()
        else:
            q_id = f"[{q.get('id', '')}]"
            q_title = title_raw
            
        html_content += f"""
        <div class="question-card">
            <div class="question-header">
                <span class="question-title">{idx + 1}. {q_title}</span>
                <span class="question-id">{q_id}</span>
            </div>"""
            
        # Image
        img_url = q.get('imageUrl')
        if img_url:
            html_content += f'\n            <img class="question-image" src="{img_url}" />'
            
        # Options
        html_content += '\n            <div class="options-list">'
        for opt in q.get('options', []):
            html_content += f'\n                <div class="option-item"><strong>({opt["label"]})</strong> {opt["text"]}</div>'
        html_content += '\n            </div>'
        
        # Answer & Explanation
        ans_str = q.get('answer', '')
        if len(ans_str) > 1:
            ans_display = ", ".join(list(ans_str))
        else:
            ans_display = ans_str
            
        html_content += f"""
            <div class="answer-section">
                <div class="answer-row">正確答案：{ans_display}</div>"""
                
        exp = q.get('explanation', '').strip()
        if exp:
            html_content += f'\n                <div class="explanation-row"><strong>解析：</strong>{exp}</div>'
            
        html_content += """
            </div>
        </div>"""
        
    html_content += HTML_TEMPLATE_END
    
    # Write temp HTML
    temp_html_path = os.path.join(WORKSPACE, f"temp_version_{i}.html")
    with open(temp_html_path, 'w', encoding='utf-8') as fh:
        fh.write(html_content)
        
    # Compile to PDF using headless Chrome
    output_pdf_path = os.path.join(OUTPUT_DIR, f"統計題庫_{year}年版.pdf")
    print(f"正在將 {version_title} 轉換為 PDF...")
    
    # Use file:// URI format for robust loading
    temp_html_uri = Path(temp_html_path).as_uri()
    
    # CommandLine: chrome --headless --disable-gpu --no-sandbox --print-to-pdf="path" temp.html
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        f"--print-to-pdf={output_pdf_path}",
        temp_html_uri
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, check=True)
        print(f"成功生成: 統計題庫_{year}年版.pdf")
    except subprocess.CalledProcessError as err:
        stderr_msg = err.stderr.decode('utf-8', errors='ignore') if err.stderr else ""
        print(f"轉換 PDF 失敗: {stderr_msg}")
        
    # Clean temp HTML file
    if os.path.exists(temp_html_path):
        try:
            os.remove(temp_html_path)
        except Exception as e:
            print(f"清理暫存檔失敗: {e}")

print("\n[SUCCESS] 5 份隨機 PDF 檔案已全部生成於 題庫隨機版_PDF 資料夾中！")
