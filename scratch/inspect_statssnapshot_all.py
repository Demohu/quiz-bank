import sys

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = [m.start() for m in re.finditer(r'statsSnapshot', html, re.IGNORECASE)]
for idx, m in enumerate(matches, 1):
    sys.stdout.buffer.write(f"Match {idx} at {m}:\n".encode('utf-8'))
    sys.stdout.buffer.write(html[max(0, m-120):min(len(html), m+180)].encode('utf-8'))
    sys.stdout.buffer.write(b"\n" + b"-"*40 + b"\n")
