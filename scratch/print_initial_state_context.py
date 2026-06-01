import sys

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Print around 18339
sys.stdout.buffer.write(html[18100:18600].encode('utf-8'))
