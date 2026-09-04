const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/common');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let newContent = content.replace(/from '(?:\.\.\/)+(utils|store|types|data)/g, "from '../../$1");

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed imports in', file);
    }
  }
});
