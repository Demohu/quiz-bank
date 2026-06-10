import json

transcript_path = r"C:\Users\liawb\.gemini\antigravity\brain\968161c8-dba8-4afd-aab2-48ab49aa7ec0\.system_generated\logs\transcript.jsonl"

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        if '"step_index":7037' in line:
            data = json.loads(line, strict=False)
            tc = data["tool_calls"][0]
            args = tc["args"]
            val = args["ReplacementContent"]
            print("val start chars:", list(val[:20]))
            print("val end chars:", list(val[-20:]))
            
            # If it's stored with literal quotes in the string, let's see:
            print("val length:", len(val))
            
            # Let's try ast.literal_eval
            import ast
            try:
                decoded_ast = ast.literal_eval(val)
                print("AST decoded type:", type(decoded_ast))
                print("AST decoded snippet:", decoded_ast[:50])
            except Exception as e:
                print("AST failed:", e)
