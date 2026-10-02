const fs = require('fs');

// --- PAGE.TSX ---
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Currency replacements
page = page.replace(/\$\{srv\.price\}/g, '{srv.price.toLocaleString("vi-VN")} ₫');
page = page.replace(/\$\{selectedService\.price\}/g, '{selectedService.price.toLocaleString("vi-VN")} ₫');
page = page.replace(/\$\{lastBooking\.servicePrice\}/g, '{lastBooking.servicePrice.toLocaleString("vi-VN")} ₫');
page = page.replace(/\$\{b\.servicePrice\}/g, '{b.servicePrice.toLocaleString("vi-VN")} ₫');

// 2. Button padding for Owner & Pet Details
page = page.replace(/px-8 py-4/g, 'px-4 py-3 sm:px-8 sm:py-4 whitespace-nowrap text-sm sm:text-base');

// 3. Fix date input overflow (adding box-border max-w-full appearance-none)
page = page.replace(/className="w-full pl-12/g, 'className="w-full max-w-[100%] box-border appearance-none pl-12');

fs.writeFileSync('src/app/page.tsx', page);
console.log('page.tsx fixed');

// --- ADMIN/PAGE.TSX ---
let admin = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Currency
admin = admin.replace(/\$\{bookings\.reduce\(\(sum, b\) => sum \+ \(b\.status === 'confirmed' \? b\.servicePrice : 0\), 0\)\}/g, '{bookings.reduce((sum, b) => sum + (b.status === \\'confirmed\\' ? b.servicePrice : 0), 0).toLocaleString("vi-VN")} ₫');
// Fix the text-xl $ sign block in admin
admin = admin.replace(/<span className="font-black text-xl">\$<\/span>/g, '<span className="font-black text-xl">₫</span>');
admin = admin.replace(/\$\{b\.servicePrice\}/g, '{b.servicePrice.toLocaleString("vi-VN")} ₫');

// 2. Add Custom Time button and input width
// Current input: className="flex-1 px-3 py-2 ... text-sm font-bold ..."
// Make the form grid or flex-col on mobile so it doesn't squish.
admin = admin.replace(/<form onSubmit=\{handleAddCustomTime\} className="flex gap-2 mb-6">/g, '<form onSubmit={handleAddCustomTime} className="flex flex-col sm:flex-row gap-3 mb-6">');
admin = admin.replace(/px-4 py-2 rounded-xl font-bold text-sm/g, 'px-4 py-3 sm:py-2 rounded-xl font-bold text-sm whitespace-nowrap w-full sm:w-auto');

// 3. Fix Target Date input overflow
admin = admin.replace(/className="w-full pl-12/g, 'className="w-full max-w-[100%] box-border appearance-none pl-12');

fs.writeFileSync('src/app/admin/page.tsx', admin);
console.log('admin/page.tsx fixed');
