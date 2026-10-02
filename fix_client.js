const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
if (page.startsWith('import Link from "next/link";\n"use client";')) {
    page = page.replace('import Link from "next/link";\n"use client";', '"use client";\nimport Link from "next/link";');
    fs.writeFileSync('src/app/page.tsx', page);
    console.log('Fixed use client directive');
} else {
    console.log('Could not find exact string match');
}
