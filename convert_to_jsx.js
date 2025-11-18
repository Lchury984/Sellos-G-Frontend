/**
 * convert_to_jsx.js
 * Node script to rename .tsx/.ts React components to .jsx and update import paths.
 * Usage: node convert_to_jsx.js
 * IMPORTANT: Review changes with git before committing.
 */
const fs = require('fs');
const path = require('path');

function walk(dir){
  const entries = fs.readdirSync(dir,{withFileTypes:true});
  for(const e of entries){
    const full = path.join(dir,e.name);
    if(e.isDirectory()){
      walk(full);
    } else {
      // process files
      if(full.endsWith('.tsx') || full.endsWith('.ts')){
        // rename .tsx to .jsx, .ts to .js (conservative)
        let newFull;
        if(full.endsWith('.tsx')) newFull = full.slice(0,-4)+'.jsx';
        else if(full.endsWith('.ts')) newFull = full.slice(0,-3)+'.js';
        try{
          fs.renameSync(full,newFull);
          console.log('Renamed', full, '->', newFull);
        }catch(err){
          console.error('Failed rename', full, err);
        }
      }
    }
  }
}

// update import statements in files to reference .jsx/.js where appropriate
function updateImports(dir){
  const entries = fs.readdirSync(dir,{withFileTypes:true});
  for(const e of entries){
    const full = path.join(dir,e.name);
    if(e.isDirectory()){
      updateImports(full);
    } else {
      if(full.endsWith('.jsx') || full.endsWith('.js') || full.endsWith('.json')){
        try{
          let content = fs.readFileSync(full,'utf8');
          // naive replacements: import ... from './X'; to './X.jsx' if file exists
          content = content.replace(/from\s+(['"])(\.\/[^'"]+?)\1/g, (m, q, pth)=>{
            const candidate1 = path.resolve(path.dirname(full), pth + '.jsx');
            const candidate2 = path.resolve(path.dirname(full), pth + '.js');
            const candidate3 = path.resolve(path.dirname(full), pth + '.tsx');
            if(fs.existsSync(candidate1)) return `from ${q}${pth}.jsx${q}`;
            if(fs.existsSync(candidate2)) return `from ${q}${pth}.js${q}`;
            if(fs.existsSync(candidate3)) return `from ${q}${pth}.tsx${q}`;
            return m;
          });
          fs.writeFileSync(full, content,'utf8');
        }catch(err){
          console.error('Failed update imports for', full, err);
        }
      }
    }
  }
}

const src = path.join(__dirname,'src');
if(!fs.existsSync(src)){
  console.error('No src folder at', src);
  process.exit(1);
}
console.log('Walking and renaming in', src);
walk(src);
console.log('Updating imports...');
updateImports(src);
console.log('Done. Please review changes.');
