const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/common');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace `from '../` with `from '../../`
    let newContent = content.replace(/from '\.\.\//g, "from '../../");
    // Replace `import ... from '../`
    newContent = newContent.replace(/import (.*) from '\.\.\//g, "import $1 from '../../");
    // Replace `require('../` with `require('../../` if any
    newContent = newContent.replace(/require\('\.\.\//g, "require('../../");

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed imports in', filePath);
    }
  }
});
