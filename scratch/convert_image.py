import base64
import json
import os

image_path = r"C:\Users\liawb\.gemini\antigravity\brain\ff9f8a27-68a4-4c0b-baf4-7deaab8e29e5\media__1780440406617.png"
json_path = r"c:\Users\liawb\OneDrive\Desktop\題庫\PMA證照題庫\PMA合併題庫_最終版.json"

# 1. Convert image to base64
with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

data_url = f"data:image/png;base64,{encoded_string}"
print(f"Base64 length: {len(encoded_string)}")

# 2. Load JSON questions
with open(json_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

# 3. Find question 44 and update imageUrl
updated = False
for q in questions:
    if q.get("title", "").startswith("[專案管理] 44."):
        q["imageUrl"] = data_url
        updated = True
        print(f"Updated question: {q['title']}")
        break

if not updated:
    # Try finding by index or other logic
    for i, q in enumerate(questions):
        if "44." in q.get("title", ""):
            q["imageUrl"] = data_url
            updated = True
            print(f"Updated question by index: {q['title']}")
            break

if updated:
    # 4. Save JSON questions back
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print("Successfully updated the JSON file!")
else:
    print("Could not find question 44 in the JSON file.")
