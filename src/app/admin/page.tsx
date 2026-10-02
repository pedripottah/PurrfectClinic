"use client";

import React, { useState, useEffect } from "react";
import { Booking } from "../../types/booking";
import { CheckCircle2, Trash2, Shield, LogOut, ArrowLeft, CalendarDays, Search } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");

  // Check session storage on mount
  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuth(true);
      loadBookings();
    }
  }, []);

  const loadBookings = () => {
    try {
      const stored = localStorage.getItem("purrfectclinic_bookings");
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    } catch {
      console.error("Could not load bookings");
    }
  };

  const saveBookingsToStorage = (updated: Booking[]) => {
    setBookings(updated);
    try {
      localStorage.setItem("purrfectclinic_bookings", JSON.stringify(updated));
    } catch {
      console.error("Could not save to local storage");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "purrfectadmin") {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuth(true);
      setError("");
      loadBookings();
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

  const handleApprove = (id: string) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b));
    saveBookingsToStorage(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this booking?")) {
      const updated = bookings.filter((b) => b.id !== id);
      saveBookingsToStorage(updated);
    }
  };

  if (!isAuth) {
    return (
      <main className="min-h-screen text-slate-800 flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
        <div className="absolute top-20 left-10 text-4xl opacity-10 pointer-events-none">🛡️</div>
        <div className="absolute bottom-40 right-20 text-4xl opacity-10 pointer-events-none">🔐</div>

        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl z-10 animate-fade-up">
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
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all font-semibold"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 mt-2"
            >
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

  const filteredBookings = bookings.filter((b) => 
    b.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    b.petName.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = bookings.filter(b => b.status === "pending").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">Clinic Admin</span>
              <span className="hidden sm:inline-block ml-3 text-xs bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                Secure Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-800">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Bookings</p>
              <p className="text-3xl font-black text-slate-800">{bookings.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Approval</p>
              <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-6 rounded-3xl shadow-sm text-white flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
              <p className="text-3xl font-black">${bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.servicePrice : 0), 0)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="font-black text-xl">$</span>
            </div>
          </div>
        </div>

        {/* Bookings Table Section */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold text-slate-800">Booking Management</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Pet Details</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {b.status === "pending" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Confirmed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-slate-400 mb-1">{b.id}</div>
                        <div className="font-bold text-slate-800">{b.date}</div>
                        <div className="text-xs text-slate-500">{b.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{b.ownerName}</div>
                        <div className="text-xs text-slate-500">{b.ownerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          {b.petType === "dog" ? "🐶" : "🐱"} {b.petName}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[120px]">{b.petBreed}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 truncate max-w-[150px]">{b.serviceName}</div>
                        <div className="font-black text-pink-500">${b.servicePrice}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {b.status === "pending" && (
                            <button
                              onClick={() => handleApprove(b.id)}
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-200 hover:border-green-500"
                              title="Approve Booking"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200 hover:border-red-500"
                            title="Delete Booking"
                          >
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
      </div>
    </main>
  );
}
