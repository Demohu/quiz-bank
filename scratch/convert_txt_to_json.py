import re
import json
import os

def parse_importable_txt(path):
    questions = []
    errors = []
    
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for index, line in enumerate(lines, 1):
        trimmed = line.strip()
        if not trimmed:
            continue
            
        try:
            parts = trimmed.split('\t')
            qText = ''
            ansStr = ''
            fileExplanation = ''
            
            if len(parts) >= 3:
                qText = parts[0]
                ansStr = parts[1]
                fileExplanation = '\t'.join(parts[2:]).strip()
            elif len(parts) == 2:
                qText = parts[0]
                ansStr = parts[1]
            else:
                match = re.search(r'(.*)\(([A-Ea-e1-5,\s]+)\)\s*$', trimmed)
                if match:
                    qText = match.group(1)
                    ansStr = match.group(2)
                else:
                    errors.append(f"Line {index}: Format error (missing tab or pattern)")
                    continue
            
            # Split by <br> tags
            qParts = [s.strip() for s in re.split(r'<br\s*/?>', qText, flags=re.IGNORECASE) if s.strip()]
            
            optionStartIdx = -1
            for j in range(1, len(qParts)):
                # Check for option prefix like (A), [A], A. or A
                if re.match(r'^(\(|\[)?[A-Ea-e1-5](\)|\]|\.)\s*', qParts[j]):
                    optionStartIdx = j
                    break
            
            title = qParts[0]
            optionsRaw = qParts[1:]
            if optionStartIdx > 0:
                title = '\n'.join(qParts[:optionStartIdx])
                optionsRaw = qParts[optionStartIdx:]
                
            imageUrl = ''
            imgMatch = re.search(r'\[img:(.*?)\]', title)
            if imgMatch:
                imageUrl = imgMatch.group(1)
                title = re.sub(r'\[img:(.*?)\]', '', title).strip()
                
            if len(optionsRaw) < 2:
                errors.append(f"Line {index}: Less than 2 options")
                continue
                
            answerMatch = re.search(r'\(([A-Ea-e1-5]+)\)', ansStr)
            if answerMatch:
                answerRaw = answerMatch.group(1).upper()
            else:
                answerRaw = re.sub(r'[\(\)]', '', ansStr).upper()
                
            options = []
            parsedExplanation = ''
            validLabels = set()
            
            for opt in optionsRaw:
                optMatch = re.match(r'^(\(|\[)?([A-Ea-e1-5])(\)|\]|\.)?\s*(.*)', opt)
                if optMatch:
                    label = optMatch.group(2).upper()
                    validLabels.add(label)
                    options.append({
                        "label": label,
                        "text": optMatch.group(4).strip()
                    })
                else:
                    cleanOpt = opt.strip()
                    if re.match(r'^(解析|說明|分析)(：|:)', cleanOpt):
                        parsedExplanation = cleanOpt
                    elif parsedExplanation:
                        parsedExplanation += '\n' + cleanOpt
                    else:
                        parsedExplanation = cleanOpt
                        
            if len(options) < 2:
                errors.append(f"Line {index}: No valid options parsed")
                continue
                
            answer = ''
            if validLabels:
                parsedAns = [char for char in answerRaw if char in validLabels]
                parsedAns.sort()
                answer = ''.join(parsedAns)
            if not answer:
                answer = ''.join(sorted([char for char in answerRaw if char in 'ABCDE12345']))
                
            finalExplanation = fileExplanation or parsedExplanation or ''
            
            # Extract question ID from title if present e.g. [EB030067]
            qId = ''
            idMatch = re.search(r'\[([A-Z0-9_-]+)\]', title)
            if idMatch:
                qId = idMatch.group(1)
            
            questions.append({
                "id": qId,
                "title": title,
                "options": options,
                "answer": answer,
                "explanation": finalExplanation,
                "imageUrl": imageUrl
            })
            
        except Exception as e:
            errors.append(f"Line {index}: Parse exception {str(e)}")
            
    return questions, errors

# Convert txt to json
txt_path = 'C:/Users/liawb/OneDrive/Desktop/題庫/extracted_questions_可匯入.txt'
json_path = 'C:/Users/liawb/OneDrive/Desktop/題庫/questions.json'

questions, errors = parse_importable_txt(txt_path)
print(f"Parsed {len(questions)} questions.")
print(f"Encountered {len(errors)} errors.")
for err in errors[:10]:
    print("Error:", err)
    
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)
    
print(f"Successfully saved to {json_path}")
