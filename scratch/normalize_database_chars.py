import os
import sys
import unicodedata

# Mapping for specific CJK radicals that NFKC doesn't decompose to standard characters
SPECIAL_MAPPING = {
    '\u2ec4': '西', # CJK RADICAL WEST TWO -> 西 (U+897F)
    '\u2ed1': '長', # CJK RADICAL LONG ONE -> 長 (U+9577)
}

def normalize_text(text):
    result = []
    for char in text:
        if char in SPECIAL_MAPPING:
            result.append(SPECIAL_MAPPING[char])
        else:
            val = ord(char)
            # Use NFKC to decompose all standard Kangxi radicals U+2F00-U+2FDF and CJK Radicals U+2E80-U+2EFF
            if (0x2F00 <= val <= 0x2FDF) or (0x2E80 <= val <= 0x2EFF):
                norm = unicodedata.normalize('NFKC', char)
                result.append(norm)
            else:
                result.append(char)
    return ''.join(result)

paths = [
    'C:/Users/liawb/OneDrive/Desktop/題庫/extracted_questions_可匯入.txt',
    'C:/Users/liawb/OneDrive/Desktop/題庫/extracted_questions.txt'
]

for path in paths:
    if not os.path.exists(path):
        print(f"Skipping {path} (not found)")
        continue
        
    print(f"Processing: {path}")
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    normalized = normalize_text(content)
    
    # Check if there are any remaining radicals
    rem = []
    for char in normalized:
        val = ord(char)
        if (0x2F00 <= val <= 0x2FDF) or (0x2E80 <= val <= 0x2EFF):
            rem.append(f"U+{val:04X}")
            
    if rem:
        print(f"Warning: Remaining radicals in {path}: {list(set(rem))}")
    else:
        print(f"Success: No radicals left in {path}!")
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(normalized)

print("Character normalization completed successfully!")
