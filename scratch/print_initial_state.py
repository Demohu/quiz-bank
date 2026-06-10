import sys

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('const initialState = {')
if idx != -1:
    sys.stdout.buffer.write(html[idx:idx+800].encode('utf-8'))
