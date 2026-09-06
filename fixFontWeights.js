const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
      file = path.join(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        results = results.concat(walk(file));
      } else { 
        if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
      }
    });
  } catch (e) {}
  return results;
}

const files = walk('d:/Jeena/Truck/src');
let changed = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/fontWeight:\s*['"](705|750|850)['"]/g, (match, p1) => {
    if (p1 === '850') return 'fontWeight: "800"';
    if (p1 === '750') return 'fontWeight: "700"';
    if (p1 === '705') return 'fontWeight: "700"';
    return match;
  });
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Fixed font weight in', f);
    changed++;
  }
});
console.log('Total files changed:', changed);
