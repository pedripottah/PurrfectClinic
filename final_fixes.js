const fs = require('fs');

// 1. page.tsx
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// Fix Language Button (show current language)
page = page.replace(/\{lang === "en" \? "VI" : "EN"\}/g, '{lang.toUpperCase()}');

// Remove floating emojis
const pageEmojis = [
    /<div className="absolute top-20 left-10 text-4xl animate-float opacity-40 pointer-events-none" style=\{\{ animationDelay: '0s' \}\}>🐾<\/div>\s*/g,
    /<div className="absolute top-40 right-20 text-4xl animate-float opacity-40 pointer-events-none" style=\{\{ animationDelay: '1s' \}\}>✨<\/div>\s*/g,
    /<div className="absolute top-80 right-10 text-5xl animate-float opacity-20 pointer-events-none" style=\{\{ animationDelay: '1\.5s' \}\}>🐟<\/div>\s*/g,
    /<div className="absolute -right-4 -top-4 text-6xl opacity-5 pointer-events-none">🐾<\/div>\s*/g
];
pageEmojis.forEach(regex => { page = page.replace(regex, ''); });

// Make steps clickable
const oldSteps = `<div key={s.num} className="flex items-center gap-2">`;
const newSteps = `<div key={s.num} onClick={() => { if (s.num === 1) setStep(1); else if (s.num === 2 && selectedService) setStep(2); else if (s.num === 3 && selectedService && bookingDate && bookingTime) setStep(3); }} className={"flex items-center gap-2 " + ((s.num === 1 || (s.num === 2 && selectedService) || (s.num === 3 && selectedService && bookingDate && bookingTime)) ? "cursor-pointer" : "opacity-50 cursor-not-allowed")}>`;
page = page.replace(oldSteps, newSteps);

fs.writeFileSync('src/app/page.tsx', page);

// 2. admin/page.tsx
let admin = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// Fix Language Button (show current language)
admin = admin.replace(/\{lang === "en" \? "VI" : "EN"\}/g, '{lang.toUpperCase()}');

// Remove floating emojis
const adminEmojis = [
    /<div className="absolute top-20 left-10 text-4xl opacity-10 pointer-events-none">🛡️<\/div>\s*/g,
    /<div className="absolute bottom-40 right-20 text-4xl opacity-10 pointer-events-none">🔐<\/div>\s*/g
];
adminEmojis.forEach(regex => { admin = admin.replace(regex, ''); });

fs.writeFileSync('src/app/admin/page.tsx', admin);

console.log('Fixes applied successfully!');
