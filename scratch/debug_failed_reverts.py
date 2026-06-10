with open(r"C:\Users\liawb\OneDrive\Desktop\題庫\src\App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for snippet 1
print("1. Search for 'min-h-screen bg-transparent flex items-center'")
idx = content.find("min-h-screen bg-transparent flex items-center")
if idx != -1:
    print("Found around index:", idx)
    print(content[idx:idx+250])
else:
    print("Not found")

# Let's search for snippet 2
print("\n2. Search for 'fixed inset-0 overflow-hidden flex flex-col bg-transparent'")
idx = content.find("fixed inset-0 overflow-hidden flex flex-col bg-transparent")
if idx != -1:
    print("Found around index:", idx)
    print(content[idx:idx+250])
else:
    print("Not found")

# Let's search for snippet 3
print("\n3. Search for 'px-8 pb-8 flex-1'")
idx = content.find("px-8 pb-8 flex-1")
if idx != -1:
    print("Found around index:", idx)
    print(content[idx-50:idx+150])
else:
    print("Not found")
