import json

transcript_path = r"C:\Users\liawb\.gemini\antigravity\brain\968161c8-dba8-4afd-aab2-48ab49aa7ec0\.system_generated\logs\transcript.jsonl"

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        if '"step_index":7037' in line:
            data = json.loads(line, strict=False)
            tc = data["tool_calls"][0]
            args = tc["args"]
            print("Type of StartLine:", type(args["StartLine"]))
            print("Type of ReplacementContent:", type(args["ReplacementContent"]))
            print("ReplacementContent raw value:", repr(args["ReplacementContent"]))
            # Let's see if it's double escaped
            val = args["ReplacementContent"]
            if val.startswith('"') and val.endswith('"'):
                print("Starts and ends with quotes")
                # Try loading it as json
                try:
                    val2 = json.loads(val)
                    print("Decoded value type:", type(val2))
                    print("Decoded value raw:", repr(val2))
                except Exception as e:
                    print("Failed to decode nested JSON:", e)
