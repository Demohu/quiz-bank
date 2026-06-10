import re

file_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update version numbers
old_version = "v4.9.9"
new_version = "v4.9.10"
updated_content, count = re.subn(old_version, new_version, content)
print(f"Updated {count} version occurrences.")

# 2. Revert 總題數 back to Total Questions
target_str = '<p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">總題數</p>'
replacement_str = '<p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Total Questions</p>'

if target_str in updated_content:
    updated_content = updated_content.replace(target_str, replacement_str)
    print("Successfully reverted '總題數' back to 'Total Questions'.")
else:
    normalized_content = updated_content.replace("\r\n", "\n")
    if target_str in normalized_content:
        normalized_content = normalized_content.replace(target_str, replacement_str)
        updated_content = normalized_content
        print("Successfully reverted '總題數' back to 'Total Questions' (normalized).")
    else:
        print("WARNING: '總題數' target string NOT found!")

# Write back
with open(file_path, "w", encoding="utf-8") as f:
    f.write(updated_content)
print("Finished writing file.")
