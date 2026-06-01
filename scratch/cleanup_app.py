import re

file_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\src\App.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the start of ReactDOM.createRoot and truncate there
match = re.search(r'ReactDOM\.createRoot', content)
if match:
    cleaned = content[:match.start()].strip()
    # Add export default App at the bottom if not present
    if "export default App" not in cleaned:
        cleaned += "\n\nexport default App;\n"
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(cleaned)
    print("Cleaned up App.jsx")
else:
    print("Could not find ReactDOM.createRoot")
