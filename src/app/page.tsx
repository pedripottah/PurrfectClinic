"use client";

import React, { useState, useEffect } from "react";
import {
  Scissors,
  Bath,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  CalendarDays,
  Dog,
  Cat,
  ArrowRight,
  ArrowLeft,
  Trash2,
  MapPin,
  Clock3,
} from "lucide-react";
import { SPA_SERVICES, AVAILABLE_TIME_SLOTS } from "../data/services";
import { SpaService, PetType, Booking } from "../types/booking";

export default function Home() {
  // Navigation tab: 'book' or 'manage'
  const [activeTab, setActiveTab] = useState<"book" | "manage">("book");

  // Step in the booking wizard (1: Service, 2: Date & Time, 3: Pet & Owner Info, 4: Success)
  const [step, setStep] = useState<number>(1);

  // Booking Form State
  const [petType, setPetType] = useState<PetType>("dog");
  const [selectedService, setSelectedService] = useState<SpaService>(SPA_SERVICES[0]);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");
  
  const [petName, setPetName] = useState<string>("");
  const [petBreed, setPetBreed] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerPhone, setOwnerPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Last completed booking for the receipt screen
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  // Stored Bookings list (loaded from localStorage)
  const [savedBookings, setSavedBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("PurrfectClinic_bookings");
      if (stored) {
        setSavedBookings(JSON.parse(stored));
      }
    } catch {
      console.error("Could not load bookings from local storage");
    }

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
    setBookingTime(AVAILABLE_TIME_SLOTS[0]);
  }, []);

  // Save bookings to localStorage whenever updated
  const saveBookingsToStorage = (updated: Booking[]) => {
    setSavedBookings(updated);
    try {
      localStorage.setItem("PurrfectClinic_bookings", JSON.stringify(updated));
    } catch {
      console.error("Could not save to local storage");
    }
  };

  // Handle booking submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!petName.trim() || !ownerName.trim() || !ownerPhone.trim()) {
      alert("Please fill in your name, phone number, and pet's name.");
      return;
    }

    const newBooking: Booking = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      petType,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      date: bookingDate,
      timeSlot: bookingTime,
      petName: petName.trim(),
      petBreed: petBreed.trim() || (petType === "dog" ? "Golden Retriever" : "Domestic Shorthair"),
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim(),
      notes: notes.trim(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...savedBookings];
    saveBookingsToStorage(updated);
    setLastBooking(newBooking);
    setStep(4); // Move to Success Receipt screen
  };

  // Reset form to start a new booking
  const handleReset = () => {
    setStep(1);
    setPetName("");
    setPetBreed("");
    setOwnerName("");
    setOwnerPhone("");
    setNotes("");
    setLastBooking(null);
  };

  // Delete a booking from manage view
  const handleDeleteBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const updated = savedBookings.filter((b) => b.id !== id);
      saveBookingsToStorage(updated);
    }
  };

  // Helper icon renderer
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "bath":
        return <Bath className="w-6 h-6 text-sky-500" />;
      case "scissors":
        return <Scissors className="w-6 h-6 text-purple-500" />;
      case "sparkles":
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      default:
        return <Heart className="w-6 h-6 text-rose-500" />;
    }
  };

  return (
    <main className="min-h-screen text-slate-800 pb-16 relative overflow-hidden">
      {/* Cute Floating Background Elements */}
      <div className="absolute top-20 left-10 text-4xl animate-float opacity-40 pointer-events-none" style={{ animationDelay: '0s' }}>🐾</div>
      <div className="absolute top-40 right-20 text-4xl animate-float opacity-40 pointer-events-none" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-40 left-32 text-3xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: '2s' }}>🦴</div>
      <div className="absolute top-80 right-10 text-5xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: '1.5s' }}>🐟</div>
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 glass-nav mb-8">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-orange-300 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 animate-pulse-slow">
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800 drop-shadow-sm">PurrfectClinic</span>
              <span className="hidden sm:inline-block ml-3 text-xs bg-white/60 backdrop-blur-sm text-pink-700 font-bold px-3 py-1 rounded-full border border-pink-200/50 shadow-sm">
                Pet Wellness Spa
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-inner">
            <button
              onClick={() => setActiveTab("book")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "book"
                  ? "bg-white text-pink-600 shadow-md transform scale-105"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              Book Service
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "manage"
                  ? "bg-white text-pink-600 shadow-md transform scale-105"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              <span>Appointments</span>
              {savedBookings.length > 0 && (
                <span className="bg-gradient-to-r from-pink-400 to-orange-400 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse-slow">
                  {savedBookings.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* TAB 1: BOOKING EXPERIENCE */}
        {activeTab === "book" && (
          <div>
            {/* Header intro banner */}
            {step < 4 && (
              <div className="text-center mb-10 animate-fade-up">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-4">
                  Pamper Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 animate-pulse-slow">Furry Best Friend</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-lg max-w-xl mx-auto font-medium">
                  Certified groomers, 100% organic shampoos, and stress-free spa treatments.
                </p>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
                  {[
                    { num: 1, label: "Select Service" },
                    { num: 2, label: "Date & Time" },
                    { num: 3, label: "Pet Details" },
                  ].map((s) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                          step === s.num
                            ? "bg-gradient-to-tr from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30 ring-4 ring-pink-100 transform scale-110"
                            : step > s.num
                            ? "bg-slate-800 text-white"
                            : "bg-white text-slate-400 shadow-sm"
                        }`}
                      >
                        {step > s.num ? "✓" : s.num}
                      </div>
                      <span
                        className={`text-xs hidden sm:inline font-bold transition-colors duration-300 ${
                          step >= s.num ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </span>
                      {s.num < 3 && <div className={`w-8 sm:w-12 h-1 rounded-full transition-colors duration-500 ${step > s.num ? "bg-slate-800" : "bg-white shadow-inner"}`} />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: SERVICE & PET TYPE */}
            {step === 1 && (
              <section className="glass-panel rounded-3xl p-6 sm:p-10 animate-fade-up relative z-10">
                <div className="mb-8">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">
                    1. Who is getting pampered?
                  </label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button
                      type="button"
                      onClick={() => setPetType("dog")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                        petType === "dog"
                          ? "border-pink-400 bg-white shadow-lg shadow-pink-100 transform scale-105 text-slate-800"
                          : "border-white/60 bg-white/40 hover:bg-white hover:border-pink-200 text-slate-500 hover:shadow-md"
                      }`}
                    >
                      <Dog className={`w-6 h-6 transition-colors ${petType === "dog" ? "text-pink-500" : "text-slate-400"}`} />
                      <span>Dog</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPetType("cat")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                        petType === "cat"
                          ? "border-pink-400 bg-white shadow-lg shadow-pink-100 transform scale-105 text-slate-800"
                          : "border-white/60 bg-white/40 hover:bg-white hover:border-pink-200 text-slate-500 hover:shadow-md"
                      }`}
                    >
                      <Cat className={`w-6 h-6 transition-colors ${petType === "cat" ? "text-pink-500" : "text-slate-400"}`} />
                      <span>Cat</span>
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-4">
                    2. Select Spa Service
                  </label>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {SPA_SERVICES.map((srv) => {
                      const isSelected = selectedService.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`relative cursor-pointer rounded-3xl border-2 p-5 transition-all duration-300 flex flex-col justify-between ${
                            isSelected
                              ? "border-pink-400 bg-white shadow-xl shadow-pink-100 transform -translate-y-1"
                              : "border-white/60 bg-white/50 hover:bg-white hover:border-pink-200 hover:shadow-lg hover:-translate-y-1"
                          }`}
                        >
                          {srv.popular && (
                            <span className="absolute -top-3 right-5 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider shadow-sm animate-pulse-slow">
                              POPULAR
                            </span>
                          )}
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-3 rounded-2xl transition-colors duration-300 ${isSelected ? "bg-pink-50" : "bg-white shadow-sm"}`}>
                                {renderServiceIcon(srv.iconName)}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-slate-800 text-lg">{srv.name}</h3>
                                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold mt-0.5">
                                  <Clock3 className="w-3.5 h-3.5" /> {srv.duration}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">
                              {srv.description}
                            </p>
                          </div>
                          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xl font-black text-slate-800">
                              ${srv.price}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                isSelected
                                  ? "border-pink-500 bg-pink-500 text-white scale-110"
                                  : "border-slate-300 bg-transparent"
                              }`}
                            >
                              {isSelected && <span className="text-sm font-bold">✓</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span>Choose Date & Time</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>
            )}

            {/* STEP 2: DATE & TIME */}
            {step === 2 && (
              <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 animate-fadeIn">
                <h2 className="text-lg font-bold text-stone-900 mb-1">Pick Date & Time</h2>
                <p className="text-xs text-stone-500 mb-6">
                  Select your preferred grooming slot for {selectedService.name}.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  {/* Date Input */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                      Appointment Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-800"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                      Available Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_TIME_SLOTS.map((slot) => {
                        const isSelected = bookingTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                              isSelected
                                ? "border-amber-500 bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-500"
                                : "border-stone-200 hover:border-stone-300 text-stone-700"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium text-sm px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    disabled={!bookingDate || !bookingTime}
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <span>Owner & Pet Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>
            )}

            {/* STEP 3: PET & OWNER FORM */}
            {step === 3 && (
              <form
                onSubmit={handleSubmitBooking}
                className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 animate-fadeIn"
              >
                <h2 className="text-lg font-bold text-stone-900 mb-1">Owner & Pet Details</h2>
                <p className="text-xs text-stone-500 mb-6">
                  Almost done! Tell us who we will be pampering.
                </p>

                {/* Pet Information */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block mb-3">
                    Pet Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Milo, Luna"
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Breed / Coat Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Poodle, British Shorthair"
                        value={petBreed}
                        onChange={(e) => setPetBreed(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block mb-3">
                    Contact Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0912 345 678"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Notes */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-stone-600 block mb-1">
                    Special Instructions / Pet Temperament
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Nervous around loud hair dryers, sensitive skin..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                {/* Summary Box */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-stone-800">{selectedService.name}</span>
                    <span className="text-stone-500 block sm:inline sm:ml-2">
                      ({bookingDate} at {bookingTime})
                    </span>
                  </div>
                  <div className="font-extrabold text-base text-amber-600">
                    Total: ${selectedService.price}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-medium text-sm px-4 py-2 rounded-lg cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-bold shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: SUCCESS RECEIPT */}
            {step === 4 && lastBooking && (
              <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 sm:p-10 text-center max-w-lg mx-auto animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-black text-stone-900">Booking Confirmed!</h2>
                <p className="text-xs text-stone-500 mt-1 mb-6">
                  We look forward to seeing {lastBooking.petName} soon!
                </p>

                {/* Receipt Card */}
                <div className="bg-amber-50/60 rounded-xl p-5 border border-amber-200 text-left mb-6 space-y-2.5 text-xs text-stone-700">
                  <div className="flex justify-between border-b border-amber-200/60 pb-2">
                    <span className="font-medium text-stone-500">Booking ID:</span>
                    <span className="font-mono font-bold text-stone-900">{lastBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-500">Pet Name:</span>
                    <span className="font-semibold">{lastBooking.petName} ({lastBooking.petType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-500">Service:</span>
                    <span className="font-semibold">{lastBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-500">Date & Slot:</span>
                    <span className="font-semibold">{lastBooking.date} • {lastBooking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-stone-500">Customer:</span>
                    <span className="font-semibold">{lastBooking.ownerName} ({lastBooking.ownerPhone})</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200/60 pt-2 text-sm font-bold text-stone-900">
                    <span>Estimated Total:</span>
                    <span className="text-amber-600">${lastBooking.servicePrice}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 font-semibold text-xs text-stone-700 cursor-pointer"
                  >
                    Book Another Pet
                  </button>
                  <button
                    onClick={() => setActiveTab("manage")}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 font-semibold text-xs text-white shadow-md cursor-pointer"
                  >
                    View All Appointments
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPOINTMENT MANAGEMENT */}
        {activeTab === "manage" && (
          <section className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Manage Appointments</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  View and manage current spa booking records (stored in local browser).
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab("book");
                  setStep(1);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm cursor-pointer self-start sm:self-auto"
              >
                + New Booking
              </button>
            </div>

            {savedBookings.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <CalendarDays className="w-12 h-12 mx-auto stroke-1 mb-2 text-stone-300" />
                <p className="font-medium text-sm text-stone-600">No appointments booked yet.</p>
                <p className="text-xs text-stone-400 mt-1">Book your first pet spa session now!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="border border-stone-200 rounded-xl p-4 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                        {b.petType === "dog" ? "🐶" : "🐱"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{b.petName}</span>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                            {b.petBreed}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">({b.id})</span>
                        </div>
                        <div className="text-xs text-stone-600 font-medium mt-1">
                          {b.serviceName} • <span className="text-amber-600 font-bold">${b.servicePrice}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 mt-1.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" /> {b.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" /> {b.timeSlot}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-stone-400" /> {b.ownerName} ({b.ownerPhone})
                          </span>
                        </div>
                        {b.notes && (
                          <p className="text-[11px] text-stone-500 italic mt-1.5 bg-stone-50 p-1.5 rounded border border-stone-100">
                            Note: {b.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Confirmed
                      </span>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        title="Cancel Appointment"
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Spa Footer */}
      <footer className="mt-16 text-center text-xs text-stone-400 border-t border-stone-200/60 pt-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> 123 Pet Haven Ave, District 1
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock3 className="w-3.5 h-3.5" /> Open Daily: 8:00 AM – 7:00 PM
          </span>
        </div>
        <p>© {new Date().getFullYear()} PurrfectClinic Pet Spa. Built with Next.js & Tailwind CSS.</p>
      </footer>
    </main>
  );
}
