import os
import re

file_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\index.html"
src_dir = r"C:\Users\liawb\OneDrive\Desktop\題庫\src"
os.makedirs(src_dir, exist_ok=True)

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

styles = re.findall(r'<style>(.*?)</style>', content, re.DOTALL)

css_content = """@tailwind base;
@tailwind components;
@tailwind utilities;

"""

for style in styles:
    css_content += style.strip() + "\n\n"

with open(os.path.join(src_dir, "index.css"), "w", encoding="utf-8") as f:
    f.write(css_content)

print("Created src/index.css")
