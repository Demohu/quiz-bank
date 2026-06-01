import os
import re

file_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\index.html"
src_dir = r"C:\Users\liawb\OneDrive\Desktop\題庫\src"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract script type="text/babel"
match = re.search(r'<script type="text/babel">(.*?)</script>\s*</body>', content, re.DOTALL)
if match:
    babel_script = match.group(1)
    
    # Remove ReactDOM.createRoot part
    babel_script = re.sub(r'const rootElement = document\.getElementById\(\'root\'\);.*?root\.render\(<App />\);', '', babel_script, flags=re.DOTALL)
    
    # Remove const { useEffect, useReducer, useRef, useState } = React;
    babel_script = re.sub(r'const \{.*?\} = React;', '', babel_script)

    app_content = "import React, { useEffect, useReducer, useRef, useState } from 'react';\n"
    app_content += babel_script.strip()
    
    # Check if there is an export default App at the end, if not add it.
    if "export default App" not in app_content:
        app_content += "\n\nexport default App;\n"

    with open(os.path.join(src_dir, "App.jsx"), "w", encoding="utf-8") as f:
        f.write(app_content)
        
    print("Created src/App.jsx")
else:
    print("Could not find <script type='text/babel'>")
