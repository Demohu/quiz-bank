with open(r"C:\Users\liawb\OneDrive\Desktop\題庫\src\App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.finditer(r"fixed inset-0 overflow-hidden flex flex-col", content)
for m in matches:
    idx = m.start()
    print("Match found:")
    print(content[idx:idx+150])
    print("-" * 40)
