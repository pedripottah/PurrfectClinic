"use client";

import React, { useState, useEffect } from "react";
import { Booking } from "../../types/booking";
import { CheckCircle2, XCircle, Trash2, Shield, LogOut, ArrowLeft, CalendarDays, Search, Settings2, Clock } from "lucide-react";
import Link from "next/link";
import { AVAILABLE_TIME_SLOTS } from "../../data/services";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customAvailability, setCustomAvailability] = useState<Record<string, string[]>>({});
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [adminTab, setAdminTab] = useState<"bookings" | "availability">("bookings");

  const [availDate, setAvailDate] = useState("");

  const loadData = () => {
    try {
      const storedBookings = localStorage.getItem("purrfectclinic_bookings");
      if (storedBookings) setBookings(JSON.parse(storedBookings));

      const storedAvailability = localStorage.getItem("purrfectclinic_availability");
      if (storedAvailability) setCustomAvailability(JSON.parse(storedAvailability));
    } catch {
      console.error("Could not load from local storage");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuth(true);
      loadData();
    }
    
    // Live reload logic
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const saveBookingsToStorage = (updated: Booking[]) => {
    setBookings(updated);
    try {
      localStorage.setItem("purrfectclinic_bookings", JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const saveAvailabilityToStorage = (updated: Record<string, string[]>) => {
    setCustomAvailability(updated);
    try {
      localStorage.setItem("purrfectclinic_availability", JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "purrfectadmin") {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuth(true);
      setError("");
      loadData();
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuth(false);
    setUsername("");
    setPassword("");
  };

  const handleUpdateStatus = (id: string, status: "confirmed" | "rejected") => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    saveBookingsToStorage(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this booking?")) {
      const updated = bookings.filter((b) => b.id !== id);
      saveBookingsToStorage(updated);
    }
  };

  const toggleAvailability = (date: string, slot: string) => {
    const baseSlots = customAvailability[date] !== undefined ? customAvailability[date] : AVAILABLE_TIME_SLOTS;
    let newSlots = [...baseSlots];
    
    if (newSlots.includes(slot)) {
      newSlots = newSlots.filter(s => s !== slot);
    } else {
      newSlots.push(slot);
      // Re-sort to maintain chronological order by sorting against the master list
      newSlots.sort((a, b) => AVAILABLE_TIME_SLOTS.indexOf(a) - AVAILABLE_TIME_SLOTS.indexOf(b));
    }

    const updated = { ...customAvailability, [date]: newSlots };
    saveAvailabilityToStorage(updated);
  };

  const disableEntireDay = (date: string) => {
    const updated = { ...customAvailability, [date]: [] };
    saveAvailabilityToStorage(updated);
  };

  const resetDay = (date: string) => {
    const updated = { ...customAvailability };
    delete updated[date];
    saveAvailabilityToStorage(updated);
  };

  if (!isAuth) {
    return (
      <main className="min-h-screen text-slate-800 flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
        <div className="absolute top-20 left-10 text-4xl opacity-10 pointer-events-none">🛡️</div>
        <div className="absolute bottom-40 right-20 text-4xl opacity-10 pointer-events-none">🔐</div>

        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-800 mb-2">Admin Portal</h1>
          <p className="text-center text-slate-500 text-sm mb-8 font-medium">Log in to manage appointments.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all font-semibold" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all font-semibold" />
            </div>
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 mt-2">
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-bold text-pink-500 hover:text-pink-600 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to main site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.ownerName.toLowerCase().includes(search.toLowerCase()) || 
                          b.petName.toLowerCase().includes(search.toLowerCase()) || 
                          b.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = bookings.filter(b => b.status === "pending").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">Clinic Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-800">View Site</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-8">
          <button onClick={() => setAdminTab("bookings")} className={`pb-3 text-sm font-bold border-b-2 transition-all ${adminTab === "bookings" ? "border-pink-500 text-pink-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            Manage Bookings
          </button>
          <button onClick={() => setAdminTab("availability")} className={`pb-3 text-sm font-bold border-b-2 transition-all ${adminTab === "availability" ? "border-pink-500 text-pink-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            Manage Availability
          </button>
        </div>

        {adminTab === "bookings" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Bookings</p>
                  <p className="text-3xl font-black text-slate-800">{bookings.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><CalendarDays className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Approval</p>
                  <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-6 rounded-3xl shadow-sm text-white flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Confirmed Rev.</p>
                  <p className="text-3xl font-black">${bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.servicePrice : 0), 0)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><span className="font-black text-xl">$</span></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button onClick={() => setFilter("all")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>All</button>
                  <button onClick={() => setFilter("pending")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter === "pending" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>Pending</button>
                  <button onClick={() => setFilter("confirmed")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter === "confirmed" ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>Approved</button>
                  <button onClick={() => setFilter("rejected")} className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter === "rejected" ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>Rejected</button>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-2.5" />
                  <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium w-full sm:w-64" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">ID & Date</th>
                      <th className="px-6 py-4">Customer & Email</th>
                      <th className="px-6 py-4">Pet Details</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">No bookings found.</td></tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${b.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : b.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${b.status === 'confirmed' ? 'bg-green-500' : b.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`}></span>
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-xs text-slate-400 mb-1">{b.id}</div>
                            <div className="font-bold text-slate-800">{b.date}</div>
                            <div className="text-xs text-slate-500">{b.timeSlot}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{b.ownerName}</div>
                            <div className="text-xs text-slate-500">{b.ownerEmail}</div>
                            <div className="text-[10px] text-slate-400">{b.ownerPhone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 flex items-center gap-2">{b.petType === "dog" ? "🐶" : "🐱"} {b.petName}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[120px]">{b.petBreed}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 truncate max-w-[150px]">{b.serviceName}</div>
                            <div className="font-black text-pink-500">${b.servicePrice}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {b.status === "pending" && (
                                <>
                                  <button onClick={() => handleUpdateStatus(b.id, "confirmed")} className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200" title="Approve">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleUpdateStatus(b.id, "rejected")} className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200" title="Reject">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleDelete(b.id)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {adminTab === "availability" && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10">
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">Manage Schedule Availability</h2>
            <p className="text-sm text-slate-500 font-medium mb-8">Select a date to customize or disable available time slots.</p>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Target Date</label>
                <div className="relative">
                  <CalendarDays className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="date"
                    value={availDate}
                    onChange={(e) => setAvailDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>

              {availDate && (
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">Time Slots for {availDate}</label>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TIME_SLOTS.map((slot) => {
                        const baseSlots = customAvailability[availDate] !== undefined ? customAvailability[availDate] : AVAILABLE_TIME_SLOTS;
                        const isEnabled = baseSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            onClick={() => toggleAvailability(availDate, slot)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isEnabled ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-100"}`}
                          >
                            <Clock className="w-3 h-3" /> {slot} {isEnabled ? "✓" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => disableEntireDay(availDate)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm border border-red-200 transition-colors">
                      Disable Entire Day
                    </button>
                    <button onClick={() => resetDay(availDate)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors">
                      Reset to Default
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
