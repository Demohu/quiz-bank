import base64
import json
import os

image_path = r"C:\Users\liawb\.gemini\antigravity\brain\ff9f8a27-68a4-4c0b-baf4-7deaab8e29e5\media__1780440406617.png"
json_path = r"c:\Users\liawb\OneDrive\Desktop\題庫\PMA證照題庫\PMA合併題庫_最終版.json"

# 1. Convert image to base64
with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

data_url = f"data:image/png;base64,{encoded_string}"

# 2. Load JSON questions
with open(json_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

# 3. Find and update questions 44 to 48
target_numbers = ["44.", "45.", "46.", "47.", "48."]
updated_count = 0

for q in questions:
    title = q.get("title", "")
    # Check if this question title starts with [專案管理] and contains any of target numbers
    if any(f" {num}" in title for num in target_numbers):
        q["imageUrl"] = data_url
        updated_count += 1
        print(f"Updated question: {title}")

# 4. Save JSON questions back if updated
if updated_count > 0:
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    print(f"Successfully updated {updated_count} questions in the JSON file!")
else:
    print("No matching questions found to update.")
