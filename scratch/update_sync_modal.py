import sys

with open('src/components/SyncModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import React from 'react';", "import React from 'react';\nimport { createPortal } from 'react-dom';")

parts = content.split('if (isMobile) {')
part1 = parts[0]
part2 = parts[1]

subparts = part2.split('// Desktop version')
mobile_part = subparts[0]
desktop_part = subparts[1]

mobile_part = mobile_part.replace('return (', 'const mobileContent = (')
mobile_part = mobile_part.replace('  }\n\n', '') 

desktop_part = desktop_part.replace('return (', 'const desktopContent = (')
desktop_part = desktop_part.replace('  );\n};\n\nexport default SyncModal;', '  );\n')

new_content = part1 + '  const mobileContent = (\n' + mobile_part.strip() + '\n  );\n\n  const desktopContent = (\n' + desktop_part.strip() + '\n\n  return createPortal(isMobile ? mobileContent : desktopContent, document.body);\n};\n\nexport default SyncModal;\n'

with open('src/components/SyncModal.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
