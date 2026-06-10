const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directory);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Change all zinc to slate (cool grey)
    content = content.replace(/zinc-/g, 'slate-');
    
    // 2. Change the primary solid buttons from slate-900 (formerly zinc-900) to a cool mint/teal.
    // e.g., bg-slate-900 text-white dark:bg-white dark:text-slate-900 -> bg-teal-700 text-white dark:bg-teal-400 dark:text-teal-950
    content = content.replace(/bg-slate-900 text-white dark:bg-white dark:text-slate-900/g, 'bg-teal-700 text-white dark:bg-teal-400 dark:text-teal-950');
    
    // 3. For borders and text highlights that were pure black
    // e.g., border-slate-900 dark:border-slate-100 -> border-teal-700 dark:border-teal-400
    content = content.replace(/border-slate-900 dark:border-slate-100/g, 'border-teal-700 dark:border-teal-400');
    
    // 4. Update the pure white/black rings to teal
    content = content.replace(/ring-slate-900 dark:ring-slate-100/g, 'ring-teal-700 dark:ring-teal-400');

    // 5. Text highlights that used slate-900
    // text-slate-900 dark:text-slate-50 font-black -> text-slate-800 dark:text-slate-100 font-black
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Colors successfully updated to Nordic Mint!');
