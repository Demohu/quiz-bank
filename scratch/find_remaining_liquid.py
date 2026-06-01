with open(r"C:\Users\liawb\OneDrive\Desktop\題庫\src\App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = list(re.finditer(r"handleMouseMove", content))
print(f"Total handleMouseMove matches: {len(matches)}")
for count, m in enumerate(matches):
    idx = m.start()
    print(f"Match {count+1} at index {idx}:")
    print(content[max(0, idx-40):min(len(content), idx+100)])
    print("-" * 40)
