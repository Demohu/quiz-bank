import sys

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Print around index 112427
sys.stdout.buffer.write(html[112200:112600].encode('utf-8'))
