import os
from pypdf import PdfReader

workspace = r"C:\Users\liawb\OneDrive\Desktop\題庫"
pdf_path = os.path.join(workspace, "722548084-Certiport-ITS-PythonD.pdf")
if not os.path.exists(pdf_path):
    pdf_files = [f for f in os.listdir(workspace) if "722548084" in f and f.lower().endswith(".pdf")]
    pdf_path = os.path.join(workspace, pdf_files[0])

reader = PdfReader(pdf_path)
out_path = os.path.join(workspace, "scratch", "inspect_pdf_utf8.txt")

with open(out_path, "w", encoding="utf-8") as f:
    for i in range(len(reader.pages)):
        f.write(f"\n=== PAGE {i+1} ===\n")
        f.write(reader.pages[i].extract_text() or "")

print("Written to", out_path)
