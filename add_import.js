const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!page.includes('import Link from "next/link";')) {
    page = 'import Link from "next/link";\n' + page;
    fs.writeFileSync('src/app/page.tsx', page);
}
console.log('Import added');
