const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /const loadData = \(\) => \{[\s\S]*?console\.error\("Could not save to local storage"\);\n\s*\}\n\s*\};/;

const newLoad = `  const loadData = async () => {
    try {
      const res = await fetch('/api/db');
      if (!res.ok) return;
      const db = await res.json();
      setSavedBookings(db.bookings || []);
      setCustomAvailability(db.availability || {});
    } catch {
      console.error('Could not load from DB');
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // Polling every 3s for real-time cloud sync
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);

    return () => clearInterval(interval);
  }, []);

  const saveBookingsToStorage = async (updated) => {
    setSavedBookings(updated);
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings: updated, availability: customAvailability })
      });
    } catch {}
  };`;

page = page.replace(regex, newLoad);
fs.writeFileSync('src/app/page.tsx', page);
console.log('page.tsx replaced');
