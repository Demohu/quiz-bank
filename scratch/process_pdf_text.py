import os
import json
import re

txt_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\scratch\inspect_pdf_utf8.txt"
if not os.path.exists(txt_path):
    print("Cannot find inspect_pdf_utf8.txt")
    exit(1)

with open(txt_path, "r", encoding="utf-8") as f:
    text = f.read()

pages = text.split("=== PAGE ")
parsed_questions = []

print(f"Total sections: {len(pages)}")

for p in pages:
    p = p.strip()
    if not p:
        continue
    
    # Split page number and content
    parts = p.split("\n", 1)
    page_num_str = parts[0].split(" ===")[0].strip()
    try:
        page_num = int(page_num_str)
    except ValueError:
        continue
    
    content = parts[1].strip() if len(parts) > 1 else ""
    if not content:
        continue
        
    print(f"Page {page_num}: length {len(content)}")
