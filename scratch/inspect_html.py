with open(r"C:\Users\liawb\OneDrive\Desktop\題庫\index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

search_terms = ["Overall", "Mastered", "Done", "Total", "進度", "題數"]
for idx, line in enumerate(lines):
    if any(term in line for term in search_terms):
        print(f"{idx+1}: {line.strip()}")
