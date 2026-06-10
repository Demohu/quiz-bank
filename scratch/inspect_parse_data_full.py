import os

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('const parseData =')
if idx != -1:
    print(html[idx:idx+4500])
else:
    print("parseData not found")
