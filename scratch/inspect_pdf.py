import os
from pypdf import PdfReader

# Find the file
workspace = r"C:\Users\liawb\OneDrive\Desktop\題庫"
pdf_files = [f for f in os.listdir(workspace) if "722548084" in f and f.lower().endswith(".pdf")]
if not pdf_files:
    print("No PDF file found matching '722548084'")
    exit(1)

pdf_path = os.path.join(workspace, pdf_files[0])
print(f"Reading: {pdf_path}")

reader = PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

# Print text of first 3 pages to inspect layout
for i in range(min(5, len(reader.pages))):
    print(f"\n--- PAGE {i+1} ---")
    text = reader.pages[i].extract_text()
    print(text)
