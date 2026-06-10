import re
import os

path = 'C:/Users/liawb/OneDrive/Desktop/題庫/index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Let's search for function parseData or const parseData
matches = [m.start() for m in re.finditer(r'parseData', html)]
for m in matches:
    print(f"parseData found at index {m}:")
    print(html[max(0, m-50):min(len(html), m+800)])
    print("-" * 40)

# Let's search for LOAD_DATA action in the reducer to see where the data goes
matches_load = [m.start() for m in re.finditer(r'LOAD_DATA', html)]
for m in matches_load:
    print(f"LOAD_DATA found at index {m}:")
    print(html[max(0, m-50):min(len(html), m+300)])
    print("-" * 40)
