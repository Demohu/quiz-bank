import re

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Let's print all occurrences of BUILTIN_QUESTIONS
matches = [m.start() for m in re.finditer(r'BUILTIN_QUESTIONS', html)]
for m in matches:
    print(f"BUILTIN_QUESTIONS found at index {m}:")
    print(html[max(0, m-20):min(len(html), m+150)])
    print("-" * 40)
