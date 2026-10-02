const fs = require('fs');
let page = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex = /const loadData = \(\) => \{[\s\S]*?\} catch \{\}\n\s*\};/;

const newLoad = `  const loadData = async () => {
    try {
      const res = await fetch('/api/db');
      if (!res.ok) return;
      const db = await res.json();
      setBookings(db.bookings || []);
      setCustomAvailability(db.availability || {});
    } catch {
      console.error('Could not load from DB');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuth(true);
      loadData();
    }
    
    const storedLang = localStorage.getItem("purrfectclinic_admin_lang");
    if (storedLang === "vi" || storedLang === "en") setLang(storedLang);

    const interval = setInterval(() => {
      if (sessionStorage.getItem("adminAuth") === "true") {
        loadData();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("purrfectclinic_admin_lang", l);
  };

  const syncToDB = async (updatedBookings, updatedAvailability) => {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings: updatedBookings, availability: updatedAvailability })
      });
    } catch {}
  };

  const saveBookingsToStorage = async (updated) => {
    setBookings(updated);
    await syncToDB(updated, customAvailability);
  };

  const saveAvailabilityToStorage = async (updated) => {
    setCustomAvailability(updated);
    await syncToDB(bookings, updated);
  };`;

page = page.replace(regex, newLoad);
fs.writeFileSync('src/app/admin/page.tsx', page);
console.log('admin/page.tsx replaced');
