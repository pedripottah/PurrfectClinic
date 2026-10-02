"use client";

import React, { useState, useEffect } from "react";
import { Booking } from "../../types/booking";
import { CheckCircle2, XCircle, Trash2, Shield, LogOut, ArrowLeft, CalendarDays, Search, Settings2, Clock, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { AVAILABLE_TIME_SLOTS } from "../../data/services";

const DICT_ADMIN = {
  en: {
    portalTitle: "Admin Portal",
    portalDesc: "Log in to manage appointments.",
    username: "Username",
    password: "Password",
    signIn: "Sign In",
    backSite: "Back to main site",
    clinicAdmin: "Clinic Admin",
    viewSite: "View Site",
    logout: "Logout",
    tabBookings: "Manage Bookings",
    tabAvailability: "Manage Availability",
    totalBookings: "Total Bookings",
    pendingApproval: "Pending Approval",
    confirmedRev: "Confirmed Rev.",
    filterAll: "All",
    filterPending: "Pending",
    filterApproved: "Approved",
    filterRejected: "Rejected",
    search: "Search...",
    colStatus: "Status",
    colID: "ID & Date",
    colCustomer: "Customer & Email",
    colPet: "Pet Details",
    colService: "Service",
    colActions: "Actions",
    noBookings: "No bookings found.",
    manageSched: "Manage Schedule Availability",
    manageSchedDesc: "Select a date to customize or disable available time slots.",
    targetDate: "Target Date",
    timeSlotsFor: "Time Slots for",
    disableDay: "Disable Entire Day",
    resetDay: "Reset to Default",
    addCustom: "Add Custom Time",
    customPh: "e.g. 02:15 PM"
  },
  vi: {
    portalTitle: "Cổng Quản Trị",
    portalDesc: "Đăng nhập để quản lý lịch hẹn.",
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    signIn: "Đăng Nhập",
    backSite: "Trở về trang chủ",
    clinicAdmin: "Quản Trị Viên",
    viewSite: "Xem Trang",
    logout: "Đăng Xuất",
    tabBookings: "Quản Lý Lịch Hẹn",
    tabAvailability: "Quản Lý Lịch Trống",
    totalBookings: "Tổng Lịch Hẹn",
    pendingApproval: "Chờ Duyệt",
    confirmedRev: "Doanh Thu",
    filterAll: "Tất Cả",
    filterPending: "Chờ Duyệt",
    filterApproved: "Đã Duyệt",
    filterRejected: "Đã Từ Chối",
    search: "Tìm kiếm...",
    colStatus: "Trạng thái",
    colID: "ID & Ngày",
    colCustomer: "Khách hàng & Email",
    colPet: "Thông tin thú cưng",
    colService: "Dịch vụ",
    colActions: "Thao tác",
    noBookings: "Không tìm thấy lịch hẹn.",
    manageSched: "Quản Lý Lịch Trống",
    manageSchedDesc: "Chọn ngày để tùy chỉnh hoặc vô hiệu hóa các khung giờ trống.",
    targetDate: "Ngày Chọn",
    timeSlotsFor: "Khung Giờ cho",
    disableDay: "Tắt Cả Ngày",
    resetDay: "Đặt Lại Mặc Định",
    addCustom: "Thêm Giờ (Tùy chỉnh)",
    customPh: "vd: 02:15 PM"
  }
};

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "vi">("en");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customAvailability, setCustomAvailability] = useState<Record<string, string[]>>({});
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [adminTab, setAdminTab] = useState<"bookings" | "availability">("bookings");

  const [availDate, setAvailDate] = useState("");
  const [customTimeInput, setCustomTimeInput] = useState("");

  const t = DICT_ADMIN[lang];

    const loadData = async () => {
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

  const changeLang = (l: "en" | "vi") => {
    setLang(l);
    localStorage.setItem("purrfectclinic_admin_lang", l);
  };

  const syncToDB = async (updatedBookings: Booking[], updatedAvailability: Record<string, string[]>) => {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings: updatedBookings, availability: updatedAvailability })
      });
    } catch {}
  };

  const saveBookingsToStorage = async (updated: Booking[]) => {
    setBookings(updated);
    await syncToDB(updated, customAvailability);
  };

  const saveAvailabilityToStorage = async (updated: Record<string, string[]>) => {
    setCustomAvailability(updated);
    await syncToDB(bookings, updated);
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

  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const sortTimeSlots = (slots: string[]) => {
    return [...slots].sort((a, b) => parseTime(a) - parseTime(b));
  };

  const toggleAvailability = (date: string, slot: string) => {
    const baseSlots = customAvailability[date] !== undefined ? customAvailability[date] : AVAILABLE_TIME_SLOTS;
    let newSlots = [...baseSlots];
    
    if (newSlots.includes(slot)) {
      newSlots = newSlots.filter(s => s !== slot);
    } else {
      newSlots.push(slot);
      newSlots = sortTimeSlots(newSlots);
    }

    const updated = { ...customAvailability, [date]: newSlots };
    saveAvailabilityToStorage(updated);
  };

  const handleAddCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availDate || !customTimeInput.trim()) return;
    
    const baseSlots = customAvailability[availDate] !== undefined ? customAvailability[availDate] : AVAILABLE_TIME_SLOTS;
    if (baseSlots.includes(customTimeInput)) {
      setCustomTimeInput("");
      return;
    }

    const newSlots = sortTimeSlots([...baseSlots, customTimeInput]);
    const updated = { ...customAvailability, [availDate]: newSlots };
    saveAvailabilityToStorage(updated);
    setCustomTimeInput("");
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

        <div className="absolute top-4 right-4">
          <button onClick={() => changeLang(lang === "en" ? "vi" : "en")} className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm text-xs font-bold text-slate-700 uppercase">
            <Globe className="w-4 h-4 text-pink-500" /> {lang === "en" ? "VI" : "EN"}
          </button>
        </div>

        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-slate-200/50 p-8 rounded-3xl shadow-xl z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-800 mb-2">{t.portalTitle}</h1>
          <p className="text-center text-slate-500 text-sm mb-8 font-medium">{t.portalDesc}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">{t.username}</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white/70 shadow-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all font-semibold" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">{t.password}</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white/70 shadow-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all font-semibold" />
            </div>
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 mt-2">
              {t.signIn}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-bold text-pink-500 hover:text-pink-600 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> {t.backSite}
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
              <span className="font-extrabold text-xl tracking-tight text-slate-800">{t.clinicAdmin}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => changeLang(lang === "en" ? "vi" : "en")} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold text-slate-700 uppercase transition-all">
              <Globe className="w-4 h-4 text-pink-500" /> {lang === "en" ? "VI" : "EN"}
            </button>
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-800">{t.viewSite}</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4" /> {t.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-8">
          <button onClick={() => setAdminTab("bookings")} className={`pb-3 text-sm font-bold border-b-2 transition-all ${adminTab === "bookings" ? "border-pink-500 text-pink-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t.tabBookings}
          </button>
          <button onClick={() => setAdminTab("availability")} className={`pb-3 text-sm font-bold border-b-2 transition-all ${adminTab === "availability" ? "border-pink-500 text-pink-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t.tabAvailability}
          </button>
        </div>

        {adminTab === "bookings" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{t.totalBookings}</p>
                  <p className="text-3xl font-black text-slate-800">{bookings.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><CalendarDays className="w-6 h-6" /></div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{t.pendingApproval}</p>
                  <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-6 rounded-3xl shadow-sm text-white flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">{t.confirmedRev}</p>
                  <p className="text-3xl font-black">${bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.servicePrice : 0), 0)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><span className="font-black text-xl">$</span></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                  <button onClick={() => setFilter("all")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{t.filterAll}</button>
                  <button onClick={() => setFilter("pending")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === "pending" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{t.filterPending}</button>
                  <button onClick={() => setFilter("confirmed")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === "confirmed" ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{t.filterApproved}</button>
                  <button onClick={() => setFilter("rejected")} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === "rejected" ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{t.filterRejected}</button>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-2.5" />
                  <input type="text" placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium w-full sm:w-64" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-4">{t.colStatus}</th>
                      <th className="px-6 py-4">{t.colID}</th>
                      <th className="px-6 py-4">{t.colCustomer}</th>
                      <th className="px-6 py-4">{t.colPet}</th>
                      <th className="px-6 py-4">{t.colService}</th>
                      <th className="px-6 py-4 text-right">{t.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">{t.noBookings}</td></tr>
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
                                  <button onClick={() => handleUpdateStatus(b.id, "confirmed")} className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleUpdateStatus(b.id, "rejected")} className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleDelete(b.id)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent">
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
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">{t.manageSched}</h2>
            <p className="text-sm text-slate-500 font-medium mb-8">{t.manageSchedDesc}</p>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">{t.targetDate}</label>
                <div className="relative">
                  <CalendarDays className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="date"
                    value={availDate}
                    onChange={(e) => setAvailDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white/70 shadow-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>

              {availDate && (
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">{t.timeSlotsFor} {availDate}</label>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const baseSlots = customAvailability[availDate] !== undefined ? customAvailability[availDate] : AVAILABLE_TIME_SLOTS;
                        // Build full list of slots (union of default and custom)
                        const allSlots = Array.from(new Set([...AVAILABLE_TIME_SLOTS, ...baseSlots]));
                        const sortedAllSlots = sortTimeSlots(allSlots);
                        
                        return sortedAllSlots.map((slot) => {
                          const isEnabled = baseSlots.includes(slot);
                          const isBooked = bookings.some(b => b.date === availDate && b.timeSlot === slot && (b.status === 'confirmed'));
                          
                          return (
                            <button
                              key={slot}
                              onClick={() => toggleAvailability(availDate, slot)}
                              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                isBooked 
                                ? "bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed opacity-80"
                                : isEnabled 
                                ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
                                : "bg-white border-slate-200 text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              <Clock className="w-3 h-3" /> {slot} {isBooked ? "(Booked)" : isEnabled ? "✓" : ""}
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Add Custom Time Form */}
                  <form onSubmit={handleAddCustomTime} className="flex gap-2 mb-6">
                    <input 
                      type="text" 
                      placeholder={t.customPh}
                      value={customTimeInput}
                      onChange={(e) => setCustomTimeInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:border-pink-300"
                    />
                    <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center gap-1">
                      <Plus className="w-4 h-4" /> {t.addCustom}
                    </button>
                  </form>

                  <div className="flex gap-3">
                    <button onClick={() => disableEntireDay(availDate)} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm border border-red-200 transition-colors">
                      {t.disableDay}
                    </button>
                    <button onClick={() => resetDay(availDate)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors border border-slate-200">
                      {t.resetDay}
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
