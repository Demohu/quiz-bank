import sys
import unicodedata

for path in ['C:/Users/liawb/OneDrive/Desktop/題庫/extracted_questions_可匯入.txt', 'C:/Users/liawb/OneDrive/Desktop/題庫/extracted_questions.txt']:
    print('=== SCANNING', path)
    found_radicals = set()
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for char in content:
        val = ord(char)
        # Kangxi Radicals range: 2F00 - 2FDF
        # CJK Radicals Supplement range: 2E80 - 2EFF
        if (0x2F00 <= val <= 0x2FDF) or (0x2E80 <= val <= 0x2EFF):
            found_radicals.add(char)
            
    for char in sorted(found_radicals):
        val = ord(char)
        try:
            name = unicodedata.name(char)
        except ValueError:
            name = "UNKNOWN"
        print(f"Radical: U+{val:04X} | {name}")
