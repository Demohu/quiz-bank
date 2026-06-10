import json

file_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Searching for external scripts/links in index.html:")
for idx, line in enumerate(lines[:100]):
    if "<script" in line or "<link" in line:
        print(f"Line {idx+1}: {line.strip()}")
