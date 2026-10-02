const fs = require('fs');

function addTypes(file) {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/saveBookingsToStorage = async \(updated\)/g, 'saveBookingsToStorage = async (updated: Booking[])');
  text = text.replace(/saveAvailabilityToStorage = async \(updated\)/g, 'saveAvailabilityToStorage = async (updated: Record<string, string[]>)');
  text = text.replace(/syncToDB = async \(updatedBookings, updatedAvailability\)/g, 'syncToDB = async (updatedBookings: Booking[], updatedAvailability: Record<string, string[]>)');
  text = text.replace(/changeLang = \(l\)/g, 'changeLang = (l: "en" | "vi")');
  fs.writeFileSync(file, text);
}

addTypes('src/app/page.tsx');
addTypes('src/app/admin/page.tsx');
console.log('Types injected');
