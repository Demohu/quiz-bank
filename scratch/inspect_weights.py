import re

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for keywords like 權, weight, rate, stats, etc.
# We'll print matches and their context
import sys
keywords = ['權', 'weight', 'stats', '機率']
for kw in keywords:
    matches = [m.start() for m in re.finditer(kw, html, re.IGNORECASE)]
    sys.stdout.buffer.write(f"=== KEYWORD: {kw} (found {len(matches)} times) ===\n".encode('utf-8'))
    for m in matches[:10]:
        sys.stdout.buffer.write(f"Index {m}:\n".encode('utf-8'))
        sys.stdout.buffer.write(html[max(0, m-80):min(len(html), m+120)].encode('utf-8'))
        sys.stdout.buffer.write(b"\n" + b"-"*40 + b"\n")
