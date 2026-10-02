const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Currency replacements
page = page.replace(/\$\{srv\.price\}/g, '{srv.price.toLocaleString("vi-VN")} ₫');
page = page.replace(/\$\{selectedService\.price\}/g, '{selectedService.price.toLocaleString("vi-VN")} ₫');
page = page.replace(/\$\{lastBooking\.servicePrice\}/g, '{lastBooking.servicePrice.toLocaleString("vi-VN")} ₫');
page = page.replace(/\$\{b\.servicePrice\}/g, '{b.servicePrice.toLocaleString("vi-VN")} ₫');

// 2. Button padding for Owner & Pet Details
page = page.replace(/px-8 py-4 rounded-full font-bold shadow-lg shadow-pink-500\/20 transition-all duration-300 hover:-translate-y-0\.5/g, 'px-4 py-3 sm:px-8 sm:py-4 rounded-full font-bold shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap text-sm sm:text-base');

// 3. Fix date input overflow (adding box-border max-w-full appearance-none)
page = page.replace(/className="w-full pl-12 pr-4 py-3 rounded-2xl border-2/g, 'className="w-full max-w-[100%] box-border appearance-none pl-12 pr-4 py-3 rounded-2xl border-2');

fs.writeFileSync('src/app/page.tsx', page);
console.log('page.tsx fixed');
