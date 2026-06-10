import os

transcript_path = r"C:\Users\liawb\.gemini\antigravity\brain\968161c8-dba8-4afd-aab2-48ab49aa7ec0\.system_generated\logs\transcript.jsonl"

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        if '"step_index":7126' in line:
            print("Length of step 7126 line in file:", len(line))
            if "truncated" in line:
                print("Line contains the word 'truncated' physically!")
            else:
                print("Line does NOT contain 'truncated' physically. It might be intact!")
            break
