"use client";

import React, { useState, useEffect } from "react";
import {
  Scissors, Bath, Sparkles, Heart, Calendar, Clock, User, Phone, CheckCircle2,
  CalendarDays, Dog, Cat, ArrowRight, ArrowLeft, Trash2, MapPin, Clock3, Globe, Mail, XCircle
} from "lucide-react";
import { SPA_SERVICES, AVAILABLE_TIME_SLOTS } from "../data/services";
import { SpaService, PetType, Booking } from "../types/booking";

// Localization Dictionary
const DICT = {
  en: {
    title: "Take care of your",
    titleHighlight: "best friend",
    subtitle: "Certified groomers, 100% organic shampoos, and stress-free spa treatments.",
    bookService: "Book Service",
    appointments: "Appointments",
    petWellness: "Pet Wellness Spa",
    step1: "Select Service",
    step2: "Date & Time",
    step3: "Pet Details",
    choosePet: "1. Who needs care?",
    dog: "Dog",
    cat: "Cat",
    selectService: "2. Select Spa Service",
    popular: "POPULAR",
    chooseDateTime: "Choose Date & Time",
    pickDateTime: "Pick Date & Time",
    selectSlotFor: "Select your preferred grooming slot for",
    apptDate: "Appointment Date",
    availSlot: "Available Time Slot",
    noSlots: "Today is unavailable or fully booked. Please select another day.",
    back: "Back",
    ownerPetDetails: "Owner & Pet Details",
    almostDone: "Almost done! Tell us who we will be caring for.",
    petInfo: "Pet Information",
    petName: "Pet Name *",
    petNamePh: "e.g. Milo, Luna",
    breed: "Breed / Coat Type",
    breedPh: "e.g. Poodle, British Shorthair",
    contactInfo: "Contact Information",
    fullName: "Your Full Name *",
    fullNamePh: "Your name",
    phone: "Phone Number *",
    phonePh: "e.g. 0912 345 678",
    email: "Email Address *",
    emailPh: "e.g. you@example.com",
    notes: "Special Instructions / Pet Temperament",
    notesPh: "e.g. Nervous around loud hair dryers, sensitive skin...",
    total: "Total:",
    confirm: "Confirm Booking",
    confirmed: "Booking Pending!",
    lookForward: "We received your request for",
    soon: "We will review it shortly.",
    bookingId: "Booking ID:",
    service: "Service:",
    dateSlot: "Date & Slot:",
    customer: "Customer:",
    estTotal: "Estimated Total:",
    bookAnother: "Book Another Pet",
    viewAll: "View All Appointments",
    manageAppt: "Manage Appointments",
    manageDesc: "View and manage current spa booking records.",
    newBooking: "+ New Booking",
    noAppt: "No appointments booked yet.",
    bookFirst: "Book your first pet spa session now!",
    confirmedTag: "Confirmed",
    pendingTag: "Pending",
    rejectedTag: "Rejected",
    note: "Note:"
  },
  vi: {
    title: "Chăm sóc",
    titleHighlight: "người bạn nhỏ",
    subtitle: "Chuyên viên chải chuốt, dầu gội 100% hữu cơ, và liệu trình spa thư giãn.",
    bookService: "Đặt lịch",
    appointments: "Lịch hẹn",
    petWellness: "Spa Thú Cưng",
    step1: "Chọn Dịch Vụ",
    step2: "Ngày & Giờ",
    step3: "Thông Tin",
    choosePet: "1. Ai cần được chăm sóc?",
    dog: "Chó",
    cat: "Mèo",
    selectService: "2. Chọn Dịch Vụ Spa",
    popular: "PHỔ BIẾN",
    chooseDateTime: "Chọn Ngày & Giờ",
    pickDateTime: "Chọn Ngày & Giờ",
    selectSlotFor: "Chọn khung giờ lý tưởng cho",
    apptDate: "Ngày Hẹn",
    availSlot: "Khung Giờ Trống",
    noSlots: "Hôm nay đã kín lịch hoặc không phục vụ. Vui lòng chọn ngày khác.",
    back: "Quay lại",
    ownerPetDetails: "Thông Tin Liên Hệ",
    almostDone: "Sắp xong rồi! Hãy cho chúng tôi biết thông tin nhé.",
    petInfo: "Thông Tin Thú Cưng",
    petName: "Tên Thú Cưng *",
    petNamePh: "vd: Milo, Luna",
    breed: "Giống / Loại Lông",
    breedPh: "vd: Poodle, Mèo Anh Lông Ngắn",
    contactInfo: "Thông Tin Khách Hàng",
    fullName: "Họ và Tên *",
    fullNamePh: "Tên của bạn",
    phone: "Số Điện Thoại *",
    phonePh: "vd: 0912 345 678",
    email: "Địa chỉ Email *",
    emailPh: "vd: ban@example.com",
    notes: "Ghi chú đặc biệt / Tính cách thú cưng",
    notesPh: "vd: Hay sợ tiếng máy sấy, da nhạy cảm...",
    total: "Tổng cộng:",
    confirm: "Xác Nhận Đặt Lịch",
    confirmed: "Đã Gửi Yêu Cầu!",
    lookForward: "Chúng tôi đã nhận được yêu cầu cho",
    soon: "Chúng tôi sẽ sớm duyệt lịch.",
    bookingId: "Mã Đặt Lịch:",
    service: "Dịch Vụ:",
    dateSlot: "Ngày & Giờ:",
    customer: "Khách Hàng:",
    estTotal: "Tổng Ước Tính:",
    bookAnother: "Đặt Lịch Khác",
    viewAll: "Xem Tất Cả Lịch Hẹn",
    manageAppt: "Quản Lý Lịch Hẹn",
    manageDesc: "Xem và quản lý hồ sơ lịch hẹn spa.",
    newBooking: "+ Đặt Lịch Mới",
    noAppt: "Chưa có lịch hẹn nào.",
    bookFirst: "Hãy đặt lịch spa đầu tiên cho thú cưng ngay!",
    confirmedTag: "Đã xác nhận",
    pendingTag: "Chờ xác nhận",
    rejectedTag: "Đã từ chối",
    note: "Ghi chú:"
  }
};

const translateService = (id: string, lang: "en" | "vi") => {
  if (lang === "en") return SPA_SERVICES.find(s => s.id === id)?.name;
  const viMap: Record<string, string> = {
    'bath-fluff': 'Tắm Thảo Dược & Sấy Khô',
    'full-groom': 'Gói Cắt Tỉa Hoàng Gia',
    'paw-nail-care': 'Cắt Móng & Chăm Sóc Đệm Chân',
    'spa-massage': 'Spa Thư Giãn & Massage'
  };
  return viMap[id] || SPA_SERVICES.find(s => s.id === id)?.name;
};

const translateDesc = (id: string, lang: "en" | "vi") => {
  if (lang === "en") return SPA_SERVICES.find(s => s.id === id)?.description;
  const viMap: Record<string, string> = {
    'bath-fluff': 'Dầu gội hữu cơ dịu nhẹ, vệ sinh tai, sấy khô kỹ lưỡng và xịt thơm hương oải hương.',
    'full-groom': 'Tắm toàn thân, cắt tỉa tạo kiểu, vệ sinh cơ bản, cắt móng, dưỡng đệm chân & đánh răng.',
    'paw-nail-care': 'Cắt móng chuẩn xác, mài nhẵn, dưỡng ẩm đệm chân và gỡ rối lông cục bộ.',
    'spa-massage': 'Ngâm bồn thảo mộc làm dịu da & lông kết hợp massage thư giãn cơ bắp nhẹ nhàng.'
  };
  return viMap[id] || SPA_SERVICES.find(s => s.id === id)?.description;
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "vi">("en");
  const t = DICT[lang];

  const [activeTab, setActiveTab] = useState<"book" | "manage">("book");
  const [step, setStep] = useState<number>(1);

  const [petType, setPetType] = useState<PetType>("dog");
  const [selectedService, setSelectedService] = useState<SpaService>(SPA_SERVICES[0]);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");
  
  const [petName, setPetName] = useState<string>("");
  const [petBreed, setPetBreed] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerPhone, setOwnerPhone] = useState<string>("");
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [savedBookings, setSavedBookings] = useState<Booking[]>([]);
  const [customAvailability, setCustomAvailability] = useState<Record<string, string[]>>({});

  const loadData = () => {
    try {
      const storedBookings = localStorage.getItem("purrfectclinic_bookings");
      if (storedBookings) setSavedBookings(JSON.parse(storedBookings));

      const storedAvailability = localStorage.getItem("purrfectclinic_availability");
      if (storedAvailability) setCustomAvailability(JSON.parse(storedAvailability));
    } catch {
      console.error("Could not load from local storage");
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData); // Sync live when admin changes things
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);

    return () => window.removeEventListener("storage", loadData);
  }, []);

  const saveBookingsToStorage = (updated: Booking[]) => {
    setSavedBookings(updated);
    try {
      localStorage.setItem("purrfectclinic_bookings", JSON.stringify(updated));
      // Dispatch storage event for same-window updates (if needed)
      window.dispatchEvent(new Event('storage'));
    } catch {
      console.error("Could not save to local storage");
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim() || !ownerName.trim() || !ownerPhone.trim() || !ownerEmail.trim()) {
      alert("Please fill in required fields.");
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
      ownerEmail: ownerEmail.trim(),
      notes: notes.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...savedBookings];
    saveBookingsToStorage(updated);
    setLastBooking(newBooking);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setPetName("");
    setPetBreed("");
    setOwnerName("");
    setOwnerPhone("");
    setOwnerEmail("");
    setNotes("");
    setBookingTime("");
    setLastBooking(null);
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const updated = savedBookings.filter((b) => b.id !== id);
      saveBookingsToStorage(updated);
    }
  };

  // Determine Available Slots dynamically
  const baseSlots = customAvailability[bookingDate] !== undefined 
    ? customAvailability[bookingDate] 
    : AVAILABLE_TIME_SLOTS;

  const bookedSlots = savedBookings
    .filter(b => b.date === bookingDate && (b.status === 'pending' || b.status === 'confirmed'))
    .map(b => b.timeSlot);
    
  const availableSlotsForDate = baseSlots.filter(s => !bookedSlots.includes(s));

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "bath": return <Bath className="w-6 h-6 text-sky-500" />;
      case "scissors": return <Scissors className="w-6 h-6 text-purple-500" />;
      case "sparkles": return <Sparkles className="w-6 h-6 text-pink-500" />;
      default: return <Heart className="w-6 h-6 text-rose-500" />;
    }
  };

  return (
    <main className="min-h-screen text-slate-800 pb-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 text-4xl animate-float opacity-40 pointer-events-none" style={{ animationDelay: '0s' }}>🐾</div>
      <div className="absolute top-40 right-20 text-4xl animate-float opacity-40 pointer-events-none" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-40 left-32 text-3xl animate-float opacity-30 pointer-events-none" style={{ animationDelay: '2s' }}>🦴</div>
      <div className="absolute top-80 right-10 text-5xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: '1.5s' }}>🐟</div>
      
      {/* Header */}
      <header className="sticky top-0 z-30 glass-nav mb-8">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-orange-300 flex items-center justify-center text-white shadow-lg shadow-pink-500/30 animate-pulse-slow">
              <span className="text-xl">🐾</span>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800 drop-shadow-sm">PurrfectClinic</span>
              <span className="hidden sm:inline-block ml-3 text-xs bg-white/60 backdrop-blur-sm text-pink-700 font-bold px-3 py-1 rounded-full border border-pink-200/50 shadow-sm">
                {t.petWellness}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === "en" ? "vi" : "en")} className="flex items-center gap-1.5 bg-white/60 hover:bg-white backdrop-blur border border-white/60 px-3 py-2 rounded-xl shadow-sm transition-all text-xs font-bold text-slate-700 uppercase">
              <Globe className="w-4 h-4 text-pink-500" /> {lang === "en" ? "VI" : "EN"}
            </button>
            <div className="hidden md:flex items-center bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-inner">
              <button onClick={() => setActiveTab("book")} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "book" ? "bg-white text-pink-600 shadow-md transform scale-105" : "text-slate-500 hover:text-slate-800 hover:bg-white/50"}`}>
                {t.bookService}
              </button>
              <button onClick={() => setActiveTab("manage")} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "manage" ? "bg-white text-pink-600 shadow-md transform scale-105" : "text-slate-500 hover:text-slate-800 hover:bg-white/50"}`}>
                <span>{t.appointments}</span>
                {savedBookings.length > 0 && <span className="bg-gradient-to-r from-pink-400 to-orange-400 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse-slow">{savedBookings.length}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === "book" && (
          <div>
            {step < 4 && (
              <div className="text-center mb-10 animate-fade-up">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-4">
                  {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 animate-pulse-slow">{t.titleHighlight}</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-lg max-w-xl mx-auto font-medium">{t.subtitle}</p>
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
                  {[{ num: 1, label: t.step1 }, { num: 2, label: t.step2 }, { num: 3, label: t.step3 }].map((s) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step === s.num ? "bg-gradient-to-tr from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30 ring-4 ring-pink-100 transform scale-110" : step > s.num ? "bg-slate-800 text-white" : "bg-white text-slate-400 shadow-sm"}`}>
                        {step > s.num ? "✓" : s.num}
                      </div>
                      <span className={`text-xs hidden sm:inline font-bold transition-colors duration-300 ${step >= s.num ? "text-slate-800" : "text-slate-400"}`}>{s.label}</span>
                      {s.num < 3 && <div className={`w-8 sm:w-12 h-1 rounded-full transition-colors duration-500 ${step > s.num ? "bg-slate-800" : "bg-white shadow-inner"}`} />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <section className="glass-panel rounded-3xl p-6 sm:p-10 animate-fade-up relative z-10">
                <div className="mb-8">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">{t.choosePet}</label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button type="button" onClick={() => setPetType("dog")} className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all duration-300 ${petType === "dog" ? "border-pink-400 bg-white shadow-lg shadow-pink-100 transform scale-105 text-slate-800" : "border-white/60 bg-white/40 hover:bg-white hover:border-pink-200 text-slate-500"}`}>
                      <Dog className={`w-6 h-6 transition-colors ${petType === "dog" ? "text-pink-500" : "text-slate-400"}`} />
                      <span>{t.dog}</span>
                    </button>
                    <button type="button" onClick={() => setPetType("cat")} className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all duration-300 ${petType === "cat" ? "border-pink-400 bg-white shadow-lg shadow-pink-100 transform scale-105 text-slate-800" : "border-white/60 bg-white/40 hover:bg-white hover:border-pink-200 text-slate-500"}`}>
                      <Cat className={`w-6 h-6 transition-colors ${petType === "cat" ? "text-pink-500" : "text-slate-400"}`} />
                      <span>{t.cat}</span>
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-4">{t.selectService}</label>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {SPA_SERVICES.map((srv) => {
                      const isSelected = selectedService.id === srv.id;
                      return (
                        <div key={srv.id} onClick={() => setSelectedService(srv)} className={`relative cursor-pointer rounded-3xl border-2 p-5 transition-all duration-300 flex flex-col justify-between ${isSelected ? "border-pink-400 bg-white shadow-xl shadow-pink-100 transform -translate-y-1" : "border-white/60 bg-white/50 hover:bg-white hover:border-pink-200 hover:-translate-y-1"}`}>
                          {srv.popular && <span className="absolute -top-3 right-5 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wider shadow-sm animate-pulse-slow">{t.popular}</span>}
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-3 rounded-2xl transition-colors duration-300 ${isSelected ? "bg-pink-50" : "bg-white shadow-sm"}`}>
                                {renderServiceIcon(srv.iconName)}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-slate-800 text-lg">{translateService(srv.id, lang)}</h3>
                                <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold mt-0.5">
                                  <Clock3 className="w-3.5 h-3.5" /> {srv.duration}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-2 font-medium">{translateDesc(srv.id, lang)}</p>
                          </div>
                          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xl font-black text-slate-800">${srv.price}</span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? "border-pink-500 bg-gradient-to-r from-pink-500 to-orange-400 text-white scale-110" : "border-slate-300 bg-transparent"}`}>
                              {isSelected && <span className="text-sm font-bold">✓</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5">
                    <span>{t.chooseDateTime}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="glass-panel rounded-3xl p-6 sm:p-10 animate-fade-up relative z-10">
                <h2 className="text-xl font-extrabold text-slate-800 mb-2">{t.pickDateTime}</h2>
                <p className="text-sm text-slate-500 font-medium mb-8">
                  {t.selectSlotFor} <span className="text-pink-500 font-bold">{translateService(selectedService.id, lang)}</span>.
                </p>

                <div className="grid sm:grid-cols-2 gap-8 mb-10">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">{t.apptDate}</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setBookingDate(e.target.value);
                          setBookingTime(""); // Reset time on date change
                        }}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-white/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-bold text-slate-700 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">{t.availSlot}</label>
                    {availableSlotsForDate.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {availableSlotsForDate.map((slot) => {
                          const isSelected = bookingTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBookingTime(slot)}
                              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border-2 text-sm font-bold transition-all duration-300 ${isSelected ? "border-pink-400 bg-pink-50 text-pink-700 shadow-md shadow-pink-100 transform scale-105" : "border-white/60 bg-white/40 hover:bg-white hover:border-pink-200 text-slate-500"}`}
                            >
                              <Clock className="w-4 h-4" />
                              <span>{slot}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-orange-50 border border-orange-200 text-orange-700 text-sm font-bold p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                        <XCircle className="w-6 h-6 mb-2 opacity-50" />
                        {t.noSlots}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-2 rounded-full hover:bg-white/50 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.back}</span>
                  </button>
                  <button type="button" disabled={!bookingDate || !bookingTime} onClick={() => setStep(3)} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5">
                    <span>{t.ownerPetDetails}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmitBooking} className="glass-panel rounded-3xl p-6 sm:p-10 animate-fade-up relative z-10">
                <h2 className="text-xl font-extrabold text-slate-800 mb-2">{t.ownerPetDetails}</h2>
                <p className="text-sm text-slate-500 font-medium mb-8">{t.almostDone}</p>

                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-pink-700 bg-pink-100/80 px-3 py-1.5 rounded-lg inline-block mb-4 border border-pink-200">{t.petInfo}</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-2">{t.petName}</label>
                      <input type="text" required placeholder={t.petNamePh} value={petName} onChange={(e) => setPetName(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-semibold text-slate-700 transition-all placeholder:text-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-2">{t.breed}</label>
                      <input type="text" placeholder={t.breedPh} value={petBreed} onChange={(e) => setPetBreed(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-semibold text-slate-700 transition-all placeholder:text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-pink-700 bg-pink-100/80 px-3 py-1.5 rounded-lg inline-block mb-4 border border-pink-200">{t.contactInfo}</h3>
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-2">{t.fullName}</label>
                      <div className="relative">
                        <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                        <input type="text" required placeholder={t.fullNamePh} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-semibold text-slate-700 transition-all placeholder:text-slate-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-2">{t.phone}</label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                        <input type="tel" required placeholder={t.phonePh} value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-semibold text-slate-700 transition-all placeholder:text-slate-400" />
                      </div>
                    </div>
                  </div>
                  {/* Email Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-2">{t.email}</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                      <input type="email" required placeholder={t.emailPh} value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-semibold text-slate-700 transition-all placeholder:text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-xs font-bold text-slate-500 block mb-2">{t.notes}</label>
                  <textarea rows={2} placeholder={t.notesPh} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border-2 border-white/60 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-400 font-medium text-slate-700 transition-all placeholder:text-slate-400" />
                </div>

                <div className="bg-white/80 rounded-2xl p-5 border-2 border-slate-100 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-slate-800 text-lg">{translateService(selectedService.id, lang)}</span>
                    <span className="text-slate-500 block sm:inline sm:ml-2 font-medium">({bookingDate} at {bookingTime})</span>
                  </div>
                  <div className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">{t.total} ${selectedService.price}</div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                  <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-2 rounded-full hover:bg-white/50 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.back}</span>
                  </button>
                  <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-pink-500/20 transition-all hover:-translate-y-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t.confirm}</span>
                  </button>
                </div>
              </form>
            )}

            {step === 4 && lastBooking && (
              <div className="glass-panel rounded-3xl shadow-xl border border-white p-8 sm:p-12 text-center max-w-xl mx-auto animate-fade-up relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 animate-pulse-slow">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-800">{t.confirmed}</h2>
                <p className="text-base text-slate-500 mt-2 mb-8 font-medium">
                  {t.lookForward} <span className="font-bold text-pink-500">{lastBooking.petName}</span>. {t.soon}
                </p>

                <div className="bg-white/80 rounded-2xl p-6 border-2 border-pink-100 text-left mb-8 space-y-3.5 text-sm text-slate-700 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-5 pointer-events-none">🐾</div>
                  <div className="flex justify-between border-b border-pink-100 pb-3">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">{t.bookingId}</span>
                    <span className="font-mono font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{lastBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">{t.service}</span>
                    <span className="font-bold text-slate-800">{translateService(lastBooking.serviceId, lang)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">{t.dateSlot}</span>
                    <span className="font-bold text-slate-800">{lastBooking.date} • {lastBooking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between border-t border-pink-100 pt-3 mt-2 font-black text-base text-slate-800">
                    <span>{t.estTotal}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">${lastBooking.servicePrice}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleReset} className="flex-1 py-4 px-6 rounded-full border-2 border-white/60 bg-white/40 hover:bg-white font-bold text-sm text-slate-700 transition-all">
                    {t.bookAnother}
                  </button>
                  <button onClick={() => setActiveTab("manage")} className="flex-1 py-4 px-6 rounded-full bg-slate-800 hover:bg-slate-900 font-bold text-sm text-white shadow-lg transition-all">
                    {t.viewAll}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "manage" && (
          <section className="glass-panel rounded-3xl p-6 sm:p-10 animate-fade-up relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/60 pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800">{t.manageAppt}</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">{t.manageDesc}</p>
              </div>
              <button onClick={() => { setActiveTab("book"); setStep(1); }} className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg transition-all self-start sm:self-auto hover:-translate-y-0.5">
                {t.newBooking}
              </button>
            </div>

            {savedBookings.length === 0 ? (
              <div className="text-center py-16 bg-white/40 rounded-2xl border-2 border-dashed border-slate-200">
                <CalendarDays className="w-16 h-16 mx-auto stroke-1 mb-4 text-pink-300" />
                <p className="font-bold text-lg text-slate-600 mb-1">{t.noAppt}</p>
                <p className="text-sm text-slate-400 font-medium">{t.bookFirst}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedBookings.map((b) => (
                  <div key={b.id} className="bg-white/70 border-2 border-white rounded-2xl p-5 hover:shadow-md hover:bg-white transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 to-orange-50 text-pink-500 border border-pink-100 flex items-center justify-center font-bold text-xl shrink-0">
                        {b.petType === "dog" ? "🐶" : "🐱"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-extrabold text-slate-800 text-lg">{b.petName}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded">ID: {b.id}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-medium mt-2">
                          <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100"><Calendar className="w-4 h-4 text-pink-400" /> {b.date}</span>
                          <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100"><Clock className="w-4 h-4 text-pink-400" /> {b.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-1 ${
                        b.status === 'confirmed' ? 'text-green-700 bg-green-50 border-green-200' : 
                        b.status === 'rejected' ? 'text-red-700 bg-red-50 border-red-200' : 
                        'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${b.status === 'confirmed' ? 'bg-green-500' : b.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {b.status === 'confirmed' ? t.confirmedTag : b.status === 'rejected' ? t.rejectedTag : t.pendingTag}
                      </span>
                      <button onClick={() => handleDeleteBooking(b.id)} title="Cancel Appointment" className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-20 text-center text-xs text-slate-400 border-t border-slate-200/50 pt-8 pb-4 relative z-10">
        <p className="font-semibold text-slate-400">© {new Date().getFullYear()} PurrfectClinic.</p>
      </footer>
    </main>
  );
}
