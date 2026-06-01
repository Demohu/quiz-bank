import re
import os

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
if not os.path.exists(path):
    print("index.html not found at path")
    sys.exit(1)

with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

print("File size:", len(html))

# Find input type='file'
matches = re.findall(r'<input[^>]+type=[\'\"]file[\'\"][^>]*>', html)
for m in matches:
    print('File input:', m)

# Let's search for readAsText
idx = html.find('readAsText')
if idx != -1:
    print('readAsText found at:', idx)
    # print context
    print("--- CONTEXT ---")
    print(html[idx-300:idx+400])
    print("---------------")
else:
    print("readAsText not found")
