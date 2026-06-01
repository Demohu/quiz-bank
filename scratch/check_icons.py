import re

file_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

icons = re.findall(r'const Icon\w+\s*=', content)
print("Icons defined:")
for icon in icons[:10]:
    print(icon)
