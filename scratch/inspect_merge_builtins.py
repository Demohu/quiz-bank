import re
import os

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for mergeWithBuiltins
idx = html.find('mergeWithBuiltins')
if idx != -1:
    print('mergeWithBuiltins found at:', idx)
    print("--- CONTEXT ---")
    print(html[idx-100:idx+600])
    print("---------------")
else:
    print("mergeWithBuiltins not found")
