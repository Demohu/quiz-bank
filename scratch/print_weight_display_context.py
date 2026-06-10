import sys

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('權重 {w.toFixed(0)}')
if idx != -1:
    sys.stdout.buffer.write(html[idx-1000:idx+300].encode('utf-8'))
