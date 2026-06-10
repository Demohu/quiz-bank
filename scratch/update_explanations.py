import json
import re
import os

files = [
    'PMA證照題庫/新增 文字文件.txt',
    'PMA證照題庫/新增 文字文件 - 複製.txt',
    'PMA證照題庫/新增 文字文件 (2).txt'
]

explanations = {}
for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for q in data:
                title = q.get('title', '')
                m = re.search(r'\d+', title)
                if m:
                    q_num = int(m.group())
                    explanations[q_num] = q.get('explanation', '')

json_path = 'PMA證照題庫/PMA合併題庫_最終版.json'
with open(json_path, 'r', encoding='utf-8') as file:
    main_data = json.load(file)

updated_count = 0
for q in main_data:
    title = q.get('title', '')
    
    # 1. Clean the title: remove [專案管理], [PMA], [cite: x]
    title = re.sub(r'\[專案管理\]\s*', '', title)
    title = re.sub(r'\[PMA\]\s*', '', title)
    title = re.sub(r'\s*\[cite:\s*\d+\]', '', title)
    q['title'] = title

    # 2. Update explanation
    m = re.search(r'^(\d+)\.', title)
    if m:
        q_num = int(m.group(1))
        if q_num in explanations:
            # Only update if the new explanation is longer/better or different
            q['explanation'] = explanations[q_num]
            updated_count += 1
            
with open(json_path, 'w', encoding='utf-8') as file:
    json.dump(main_data, file, ensure_ascii=False, indent=2)

print(f"Updated {updated_count} explanations.")
