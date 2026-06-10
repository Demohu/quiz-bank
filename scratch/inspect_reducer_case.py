import os

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find("case 'UPDATE_QUESTIONS_MID_QUIZ':")
if idx != -1:
    print(html[idx:idx+3500])
else:
    print("case UPDATE_QUESTIONS_MID_QUIZ not found")
