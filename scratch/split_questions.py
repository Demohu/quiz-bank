import json
import os
import re

workspace = r"C:\Users\liawb\OneDrive\Desktop\題庫"
public_dir = os.path.join(workspace, "public")
questions_path = os.path.join(public_dir, "questions.json")

if not os.path.exists(questions_path):
    print(f"Error: {questions_path} does not exist.")
    exit(1)

with open(questions_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

eb01 = []
eb02 = []
eb03 = []

for q in questions:
    title = q.get("title", "")
    m = re.match(r"^\[(EB\d+)\]", title)
    if m:
        code = m.group(1)
        if code.startswith("EB01"):
            eb01.append(q)
        elif code.startswith("EB02"):
            eb02.append(q)
        elif code.startswith("EB03"):
            eb03.append(q)

print(f"EB01 count: {len(eb01)}")
print(f"EB02 count: {len(eb02)}")
print(f"EB03 count: {len(eb03)}")

with open(os.path.join(public_dir, "eb01_questions.json"), "w", encoding="utf-8") as f:
    json.dump(eb01, f, ensure_ascii=False, indent=2)

with open(os.path.join(public_dir, "eb02_questions.json"), "w", encoding="utf-8") as f:
    json.dump(eb02, f, ensure_ascii=False, indent=2)

with open(os.path.join(public_dir, "eb03_questions.json"), "w", encoding="utf-8") as f:
    json.dump(eb03, f, ensure_ascii=False, indent=2)

print("Split completed successfully!")
