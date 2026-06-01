import sys

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

idx_f = html.find('const handleFileUpload =')
if idx_f != -1:
    sys.stdout.buffer.write(b"--- handleFileUpload ---\n")
    sys.stdout.buffer.write(html[idx_f:idx_f+1000].encode('utf-8'))
    sys.stdout.buffer.write(b"\n------------------------\n")
