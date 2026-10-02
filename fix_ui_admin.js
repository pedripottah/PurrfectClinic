const fs = require('fs');

let admin = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Currency
admin = admin.replace(/\$\{bookings\.reduce\(\(sum, b\) => sum \+ \(b\.status === 'confirmed' \? b\.servicePrice : 0\), 0\)\}/g, '{bookings.reduce((sum, b) => sum + (b.status === "confirmed" ? b.servicePrice : 0), 0).toLocaleString("vi-VN")} ₫');
// Fix the text-xl $ sign block in admin
admin = admin.replace(/<span className="font-black text-xl">\$<\/span>/g, '<span className="font-black text-xl">₫</span>');
admin = admin.replace(/\$\{b\.servicePrice\}/g, '{b.servicePrice.toLocaleString("vi-VN")} ₫');

// 2. Add Custom Time button and input width
admin = admin.replace(/<form onSubmit=\{handleAddCustomTime\} className="flex gap-2 mb-6">/g, '<form onSubmit={handleAddCustomTime} className="flex flex-col sm:flex-row gap-3 mb-6">');
admin = admin.replace(/px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center gap-1/g, 'px-4 py-3 sm:py-2 rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center gap-1 justify-center sm:w-auto w-full whitespace-nowrap');

// 3. Fix Target Date input overflow
admin = admin.replace(/className="w-full pl-12/g, 'className="w-full max-w-[100%] box-border appearance-none pl-12');

fs.writeFileSync('src/app/admin/page.tsx', admin);
console.log('admin/page.tsx fixed');
