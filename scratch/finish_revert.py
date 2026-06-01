app_jsx_path = r"C:\Users\liawb\OneDrive\Desktop\題庫\src\App.jsx"

with open(app_jsx_path, "r", encoding="utf-8") as f:
    content = f.read()

# Revert md-col-span-7 card
target = 'onMouseMove={handleMouseMove} className="md:col-span-7 liquid-glass-card liquid-shine-container shadow-sm rounded-[30px] p-8 text-left dark:text-zinc-100"'
replacement = 'className="md:col-span-7 bg-white/90 border border-white shadow-sm rounded-[30px] p-8 text-left dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100"'

if target in content:
    content = content.replace(target, replacement)
    print("Reverted md-col-span-7 card successfully!")
else:
    # Try normalizing spaces
    print("Failed to find target card in App.jsx directly.")

# Also remove handleMouseMove definition
handle_mouse_move_def = """      const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
      };"""

if handle_mouse_move_def in content:
    content = content.replace(handle_mouse_move_def, "")
    print("Removed handleMouseMove successfully!")
else:
    # Try standard spacing
    clean_def = handle_mouse_move_def.replace("\r\n", "\n")
    content_clean = content.replace("\r\n", "\n")
    if clean_def in content_clean:
        content_clean = content_clean.replace(clean_def, "")
        content = content_clean
        print("Removed handleMouseMove successfully (after normalizing newlines)!")

with open(app_jsx_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Finished clean up.")
