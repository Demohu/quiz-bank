import json

transcript_path = r"C:\Users\liawb\.gemini\antigravity\brain\968161c8-dba8-4afd-aab2-48ab49aa7ec0\.system_generated\logs\transcript.jsonl"

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line, strict=False)
            step = data.get("step_index")
            if step in [7033, 7037]:
                print(f"Step {step}:")
                for tc in data.get("tool_calls", []):
                    args = tc.get("args", {})
                    if isinstance(args, str):
                        args = json.loads(args, strict=False)
                    
                    def clean_val(val):
                        if isinstance(val, str) and val.startswith('"') and val.endswith('"'):
                            try:
                                return json.loads(val, strict=False)
                            except:
                                return val
                        return val
                    
                    print("  TargetContent:")
                    print(clean_val(args.get("TargetContent")))
                    print("  ReplacementContent:")
                    print(clean_val(args.get("ReplacementContent")))
        except Exception as e:
            pass
