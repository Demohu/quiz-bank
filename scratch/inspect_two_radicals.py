import sys

for path in ['C:/Users/liawb/OneDrive/Desktop/題庫/extracted_questions_可匯入.txt', 'C:/Users/liawb/OneDrive/Desktop/題庫/extracted_questions.txt']:
    print('=== USAGES IN', path)
    with open(path, 'r', encoding='utf-8') as f:
        for line_no, line in enumerate(f, 1):
            for char in line:
                if ord(char) in [0x2EC4, 0x2ED1]:
                    out = f"Line {line_no}: U+{ord(char):04X} context -> {line.strip()[:100]}\n"
                    sys.stdout.buffer.write(out.encode('utf-8'))
