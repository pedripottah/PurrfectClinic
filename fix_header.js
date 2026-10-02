const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Replace the header logo with a Link and remove the "pet wellness spa" pill
const oldHeader = `<div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-orange-300 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 animate-pulse-slow">
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800 drop-shadow-sm">PurrfectClinic</span>
              <span className="hidden sm:inline-block ml-3 text-xs bg-white/60 backdrop-blur-sm text-pink-700 font-bold px-3 py-1 rounded-full border border-pink-200/50 shadow-sm">
                {t.petWellness}
              </span>
            </div>
          </div>`;

const newHeader = `<Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-orange-300 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 animate-pulse-slow">
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800 drop-shadow-sm">PurrfectClinic</span>
            </div>
          </Link>`;

page = page.replace(oldHeader, newHeader);

// 2. Remove footer
const footerStart = page.indexOf('{/* Footer */}');
if (footerStart !== -1) {
    const footerEnd = page.indexOf('</footer>', footerStart) + '</footer>'.length;
    page = page.substring(0, footerStart) + page.substring(footerEnd);
}

fs.writeFileSync('src/app/page.tsx', page);
console.log('page.tsx updated');
