import json

json_path = r"c:\Users\liawb\OneDrive\Desktop\題庫\PMA證照題庫\PMA合併題庫_最終版.json"

# 1. Load JSON questions
with open(json_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

# 2. Process all question titles
updated_count = 0
for q in questions:
    title = q.get("title", "")
    new_title = title
    if title.startswith("[專案管理] "):
        new_title = title[len("[專案管理] "):]
    elif title.startswith("[專案管理]"):
        new_title = title[len("[專案管理]"):]
    
    if new_title != title:
        q["title"] = new_title
        updated_count += 1

# 3. Save JSON questions back if updated
if updated_count > 0:
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print(f"Successfully removed prefix from {updated_count} question titles in the JSON file!")
else:
    print("No matching question titles found to update.")
