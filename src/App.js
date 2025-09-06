import React, { useMemo, useState } from "react";
import "./App.css";
import "./index.css";
import logo from "./logo.svg";
// Simple pages are implemented inside this file to keep the exact file list.

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "services", label: "Services" },
  { key: "doctors", label: "Doctors" },
  { key: "reviews", label: "Reviews" },
  { key: "contact", label: "Contact" },
  { key: "profile", label: "Profile" },
];
function Sidebar({ collapsed, onToggle, active, setActive }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="brand">
          <img src={logo} alt="logo" className="brand-logo" />
          {!collapsed && <span className="brand-name">Smile Studio</span>}
        </div>
        <button className="collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((n) => (
          <button
            key={n.key}
            className={`nav-item ${active === n.key ? "active" : ""}`}
            onClick={() => setActive(n.key)}
          >
            <span className="nav-icon">•</span>
            {!collapsed && <span>{n.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

/* ---------------- Services Page ---------------- */

const SERVICES = ["Teeth Whitening", "Root Canal", "Braces Consultation", "Implant Checkup"];
const DOCTORS = ["Dr. Anika Rahman", "Dr. Kamal Hasan", "Dr. Sara Chowdhury"];

function ServicesPage() {
  const [service, setService] = useState(SERVICES[0]);
  const [doctor, setDoctor] = useState(DOCTORS[0]);
  const [monthIndex, setMonthIndex] = useState(6); // July is 6 (0-based)
  const [year] = useState(2024);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 6, 5)); // 5 July 2024
  const [selectedTime, setSelectedTime] = useState("10:30 AM");

  const times = [
    "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
    "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM"
  ];
  const disabledTimes = new Set(["12:00 PM", "5:30 PM"]);

  const monthName = useMemo(
    () => new Date(year, monthIndex).toLocaleString("en-US", { month: "long" }),
    [monthIndex, year]
  );

  const calendar = useMemo(() => {
    const first = new Date(year, monthIndex, 1);
    const startDay = (first.getDay() + 6) % 7; 
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthIndex, year]);

  const isSameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="page">
      <h1 className="page-title">Book an Appointment</h1>

      <div className="row gap">
        <div className="select-wrap">
          <label className="label">Service</label>
          <select className="select" value={service} onChange={(e) => setService(e.target.value)}>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="select-wrap">
          <label className="label">Doctor</label>
          <select className="select" value={doctor} onChange={(e) => setDoctor(e.target.value)}>
            {DOCTORS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="calendar-card">
        <div className="cal-head">
          <button className="chev" onClick={() => setMonthIndex((m) => Math.max(0, m - 1))}>‹</button>
          <div className="cal-title">{monthName} {year}</div>
          <button className="chev" onClick={() => setMonthIndex((m) => Math.min(11, m + 1))}>›</button>
        </div>

        <div className="cal-grid">
          {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
          {calendar.map((d, i) => {
            const isSelected = isSameDay(d, selectedDate);
            const isJuly5 = d && d.getMonth() === 6 && d.getDate() === 5 && d.getFullYear() === 2024;
            return (
              <button
                key={i}
                className={`cal-cell ${d ? "" : "empty"} ${isSelected ? "selected" : ""} ${isJuly5 ? "accent" : ""}`}
                disabled={!d}
                onClick={() => d && setSelectedDate(d)}
              >
                {d ? d.getDate() : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="times-wrap">
        <h2 className="times-title">
          Available Times on{" "}
          {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </h2>

        <div className="times-grid">
          {times.map((t) => {
            const disabled = disabledTimes.has(t);
            const active = selectedTime === t;
            return (
              <button
                key={t}
                className={`time-btn ${active ? "active" : ""}`}
                disabled={disabled}
                onClick={() => !disabled && setSelectedTime(t)}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="actions">
          <button className="primary">Confirm Booking</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Doctors Page ---------------- */

function avatarFromName(name) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="avatar" aria-hidden>
      {initials}
    </div>
  );
}

function DoctorsPage() {
  const allDoctors = useMemo(() => {
    const names = [
      "Dr. Anika Rahman","Dr. Kamal Hasan","Dr. Sara Chowdhury","Dr. Tanvir Ahmed",
      "Dr. Nabila Islam","Dr. Rafiul Karim","Dr. Faria Noman","Dr. Mahin Khan",
      "Dr. Nusrat Noor","Dr. Omar Siddiqui","Dr. Jaya Sengupta","Dr. Priyo Das",
      "Dr. Ayman Haque","Dr. Ruhee Akter","Dr. Tahsin Alam","Dr. Zara Jahan",
      "Dr. Partha Roy","Dr. Arif Hossain","Dr. Maria Huda","Dr. Rion Biswas",
      "Dr. Samiul Arefin","Dr. Shaila Akter","Dr. Sakib Rahman"
    ];
    return names.map((n, i) => ({
      id: i + 1,
      name: n,
      email: n.toLowerCase().replaceAll(" ", ".").replaceAll("dr.", "dr") + "@clinic.example"
    }));
  }, []);

  const pageSize = 6;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(allDoctors.length / pageSize);
  const pageData = allDoctors.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="page">
      <h1 className="page-title">Doctors</h1>

      <div className="doctor-list">
        {pageData.map((d) => (
          <div key={d.id} className="doctor-card">
            {avatarFromName(d.name)}
            <div className="doctor-info">
              <div className="doctor-name">{d.name}</div>
              <div className="doctor-email">{d.email}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Prev
        </button>
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            className={`page-num ${page === i + 1 ? "current" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className="page-btn" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
          Next
        </button>
      </div>
    </div>
  );
}

/* ---------------- Contact Page ---------------- */
function ContactPage() {
  return (
    <div className="page">
      <h1 className="page-title">Contact Us</h1>
      <p className="muted">We’d love to hear from you! Reach us at:</p>
      <ul style={{ lineHeight: "1.8" }}>
        <li><b>Email:</b> support@smilestudio.com</li>
        <li><b>Phone:</b> +880-1234-567890</li>
        <li><b>Address:</b> 123 Smile Street, Dhaka, Bangladesh</li>
      </ul>
      <form style={{ marginTop: "20px", maxWidth: "400px" }}>
        <label className="label">Your Name</label>
        <input className="select" type="text" placeholder="Enter your name" />
        <label className="label">Your Message</label>
        <textarea className="select" rows="4" placeholder="Write your message"></textarea>
        <button className="primary" style={{ marginTop: "10px" }}>Send Message</button>
      </form>
    </div>
  );
}

/* ---------------- Profile Page ---------------- */
function ProfilePage() {
  return (
    <div className="page">
      <h1 className="page-title">My Profile</h1>
      <div className="doctor-card" style={{ maxWidth: "400px" }}>
        <div className="avatar">MH</div>
        <div>
          <div className="doctor-name">Md Hisham Mahmud</div>
          <div className="doctor-email">hisham@example.com</div>
        </div>
      </div>
      <p style={{ marginTop: "20px" }}>
        This is your profile page. You can update your details, check your appointments, and manage your account.
      </p>
    </div>
  );
}

/* ---------------- Reviews Page ---------------- */
function ReviewsPage() {
  const reviews = [
    { id: 1, name: "Ayesha Khan", text: "Excellent service! The doctor was very professional and caring." },
    { id: 2, name: "Rafiul Islam", text: "Quick and painless appointment. Highly recommend Smile Studio!" },
    { id: 3, name: "Nusrat Jahan", text: "The staff were friendly and the environment was clean." }
  ];

  return (
    <div className="page">
      <h1 className="page-title">Patient Reviews</h1>
      <div className="doctor-list">
        {reviews.map((r) => (
          <div key={r.id} className="doctor-card">
            <div className="avatar">{r.name[0]}</div>
            <div>
              <div className="doctor-name">{r.name}</div>
              <div className="muted">{r.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("services");

  return (
    <div className="app-root">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        active={active}
        setActive={setActive}
      />

      <main className="content">
        {active === "home" && (
          <Placeholder title="Home" text="Welcome to Smile Studio." />
        )}
        {active === "services" && <ServicesPage />}
        {active === "doctors" && <DoctorsPage />}
        {active === "reviews" && <ReviewsPage />}
        {active === "contact" && <ContactPage />}
        {active === "profile" && <ProfilePage />}
      </main>
    </div>
  );
}

/* ---------------- Placeholder ---------------- */
const Placeholder = ({ title, text }) => (
  <div className="page">
    <h1 className="page-title">{title}</h1>
    <p className="muted">{text}</p>
  </div>
);
