import { useState, useMemo, useEffect } from "react";

const SERVICES = ["Retirement Planning","Investment Advice","Wills & Estate Planning","Tax Advice","UK Pension Transfer","Regular Saving","Property Investments","Insurance","US Retirement Plans"];
const FUND_SIZES = ["Less than £100,000","£100,000 to £250,000","£250,000 to £500,000","More than £500,000"];

const COUNTRIES = [
  { name: "United Arab Emirates", code: "AE", dial: "+971" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "United States", code: "US", dial: "+1" },
  { name: "Afghanistan", code: "AF", dial: "+93" },
  { name: "Albania", code: "AL", dial: "+355" },
  { name: "Algeria", code: "DZ", dial: "+213" },
  { name: "Argentina", code: "AR", dial: "+54" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Austria", code: "AT", dial: "+43" },
  { name: "Bahrain", code: "BH", dial: "+973" },
  { name: "Bangladesh", code: "BD", dial: "+880" },
  { name: "Belgium", code: "BE", dial: "+32" },
  { name: "Brazil", code: "BR", dial: "+55" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "China", code: "CN", dial: "+86" },
  { name: "Colombia", code: "CO", dial: "+57" },
  { name: "Cyprus", code: "CY", dial: "+357" },
  { name: "Czech Republic", code: "CZ", dial: "+420" },
  { name: "Denmark", code: "DK", dial: "+45" },
  { name: "Egypt", code: "EG", dial: "+20" },
  { name: "Finland", code: "FI", dial: "+358" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "Greece", code: "GR", dial: "+30" },
  { name: "Hong Kong", code: "HK", dial: "+852" },
  { name: "Hungary", code: "HU", dial: "+36" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "Indonesia", code: "ID", dial: "+62" },
  { name: "Ireland", code: "IE", dial: "+353" },
  { name: "Israel", code: "IL", dial: "+972" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "Jordan", code: "JO", dial: "+962" },
  { name: "Kenya", code: "KE", dial: "+254" },
  { name: "Kuwait", code: "KW", dial: "+965" },
  { name: "Lebanon", code: "LB", dial: "+961" },
  { name: "Luxembourg", code: "LU", dial: "+352" },
  { name: "Malaysia", code: "MY", dial: "+60" },
  { name: "Malta", code: "MT", dial: "+356" },
  { name: "Mexico", code: "MX", dial: "+52" },
  { name: "Morocco", code: "MA", dial: "+212" },
  { name: "Netherlands", code: "NL", dial: "+31" },
  { name: "New Zealand", code: "NZ", dial: "+64" },
  { name: "Nigeria", code: "NG", dial: "+234" },
  { name: "Norway", code: "NO", dial: "+47" },
  { name: "Oman", code: "OM", dial: "+968" },
  { name: "Pakistan", code: "PK", dial: "+92" },
  { name: "Philippines", code: "PH", dial: "+63" },
  { name: "Poland", code: "PL", dial: "+48" },
  { name: "Portugal", code: "PT", dial: "+351" },
  { name: "Qatar", code: "QA", dial: "+974" },
  { name: "Romania", code: "RO", dial: "+40" },
  { name: "Russia", code: "RU", dial: "+7" },
  { name: "Saudi Arabia", code: "SA", dial: "+966" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "South Africa", code: "ZA", dial: "+27" },
  { name: "South Korea", code: "KR", dial: "+82" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Sweden", code: "SE", dial: "+46" },
  { name: "Switzerland", code: "CH", dial: "+41" },
  { name: "Taiwan", code: "TW", dial: "+886" },
  { name: "Thailand", code: "TH", dial: "+66" },
  { name: "Turkey", code: "TR", dial: "+90" },
  { name: "Ukraine", code: "UA", dial: "+380" },
  { name: "Vietnam", code: "VN", dial: "+84" },
];

const FLAG = (code) => code.toUpperCase().split("").map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join("");
const DAYS_HEADER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MIN_PHONE_LENGTH = 4;
const MAX_PHONE_LENGTH = 15;
const IS_DEV = typeof import.meta !== "undefined" && import.meta.env?.DEV;

// ─── TIMEZONE HELPERS ───
// Slots are defined in UAE time (Asia/Dubai, UTC+4)
const UAE_TZ = "Asia/Dubai";

// Raw UAE slot hours (9:00 to 16:30)
const UAE_SLOTS_RAW = (() => {
  const s = [];
  for (let h = 9; h < 17; h++) {
    s.push({ h, m: 0 });
    s.push({ h, m: 30 });
  }
  return s;
})();

// Build a UTC Date for a given date + hour/min in UAE timezone
const uaeDateToUTC = (year, month, day, hour, min) => {
  // Create an ISO string as if it's UTC, then adjust for UAE offset (+4)
  const d = new Date(Date.UTC(year, month, day, hour - 4, min));
  return d;
};

// Format a Date to HH:MM in a given timezone
const fmtTime = (date, tz) => {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz });
};

// Format a Date to YYYY-MM-DD in a given timezone
const fmtDateISO = (date, tz) => {
  const parts = date.toLocaleDateString("en-CA", { timeZone: tz }); // en-CA gives YYYY-MM-DD
  return parts;
};

// Get short timezone label like "GMT+4" or "GMT-5"
const getTZLabel = (tz) => {
  try {
    const now = new Date();
    const short = now.toLocaleTimeString("en-US", { timeZone: tz, timeZoneName: "short" });
    const match = short.match(/[A-Z]{2,5}[+-]?\d*|UTC|GMT[+-]?\d*/);
    if (match) return match[0];
    // Fallback: extract offset
    const longName = now.toLocaleTimeString("en-US", { timeZone: tz, timeZoneName: "longOffset" });
    const offMatch = longName.match(/GMT[+-]\d{1,2}(:\d{2})?/);
    return offMatch ? offMatch[0] : tz.split("/").pop().replace(/_/g, " ");
  } catch {
    return tz;
  }
};

// Friendly timezone name like "Europe/London" → "London"
const friendlyTZ = (tz) => {
  try { return tz.split("/").pop().replace(/_/g, " "); } catch { return tz; }
};

// ─── CALENDAR HELPERS ───
const getCalendarDays = (y, m) => {
  const fd = new Date(y, m, 1);
  let sd = fd.getDay() === 0 ? 6 : fd.getDay() - 1;
  const ld = new Date(y, m + 1, 0);
  const d = [];
  for (let i = 0; i < sd; i++) d.push(null);
  for (let i = 1; i <= ld.getDate(); i++) d.push(i);
  return d;
};
const isWeekday = (y, m, d) => { const dow = new Date(y, m, d).getDay(); return dow !== 0 && dow !== 6; };
const isPast = (y, m, d) => { const t = new Date(); t.setHours(0,0,0,0); return new Date(y, m, d) < t; };
const isToday = (y, m, d) => { const t = new Date(); return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d; };

function useIsMobile(bp = 640) {
  const [m, setM] = useState(
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

// ─── FIX #8: StepBar and Header extracted outside component ───
function StepBar({ step }) {
  return (
    <nav aria-label="Booking progress" style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ ...S.stepDot, ...(step >= 1 ? S.stepDotActive : {}) }} aria-current={step === 1 ? "step" : undefined}>1</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: step >= 1 ? "#0B5D5F" : "#94a3b8" }}>Pick a Time</span>
      </div>
      <div style={{ flex: 1, height: 2, background: step >= 2 ? "#0B5D5F" : "#d1dde0", margin: "0 12px", borderRadius: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ ...S.stepDot, ...(step >= 2 ? S.stepDotActive : {}) }} aria-current={step === 2 ? "step" : undefined}>2</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: step >= 2 ? "#0B5D5F" : "#94a3b8" }}>Your Details</span>
      </div>
    </nav>
  );
}

function Header({ title, subtitle, mobile }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
        <svg width={mobile ? 155 : 200} height="26" viewBox="0 0 227 26" fill="none" aria-label="HoxtonWealth" role="img"><path d="M45.186 0H37.77a2.7 2.7 0 0 0-2.57 1.871l-2.347 7.264c-.718 2.223-2.112 3.729-5.529 3.729h-4.819l3.471-10.745A1.62 1.62 0 0 0 24.434 0h-7.416a2.7 2.7 0 0 0-2.57 1.871L12.1 9.135c-.718 2.223-2.112 3.729-5.529 3.729H0l13.6 12.275a3.337 3.337 0 0 0 5.411-1.451l3.1-9.6L34.35 25.139a3.337 3.337 0 0 0 5.411-1.451l3.5-10.823 3.468-10.746A1.62 1.62 0 0 0 45.186 0" fill="#0B5D5F"/><path d="M81.932 9.337c-4.512 0-6.939 2.941-6.939 7.34s2.428 7.34 6.939 7.34 6.94-2.941 6.94-7.34-2.428-7.34-6.94-7.34m0 12.673c-2.77 0-4.083-2.079-4.083-5.335s1.313-5.334 4.083-5.334 4.085 2.079 4.085 5.334-1.316 5.334-4.085 5.334m37.181-12.673c-4.512 0-6.939 2.941-6.939 7.34s2.427 7.34 6.939 7.34 6.939-2.941 6.939-7.34-2.428-7.34-6.939-7.34m0 12.673c-2.77 0-4.084-2.079-4.084-5.335s1.314-5.334 4.084-5.334 4.086 2.082 4.086 5.334-1.314 5.333-4.083 5.333m54.257-12.7c-4.712 0-7.225 3.341-7.225 7.367 0 4 2.542 7.34 7.454 7.34 4.2 0 6.025-2.4 6.654-4.626h-3.569a2.94 2.94 0 0 1-3.2 2.142c-2.42 0-3.73-1.833-3.766-3.993h10.7v-.749c0-4.312-2.371-7.481-7.054-7.481m-3.627 5.734a3.475 3.475 0 0 1 3.627-3.25 3.31 3.31 0 0 1 3.484 3.25Zm-99.648-2.177h-9.18V4.993h-2.856v18.822h2.856v-8.666h9.18v8.666h2.856V4.993h-2.856Zm151.307-3.555a4.98 4.98 0 0 0-4.226 1.885v-6.2h-3.713v18.821h3.712v-8.281c0-2.256 1.085-3.655 3.141-3.655 1.971 0 3 1.2 3 3.369v8.567h3.712v-8.709c0-3.655-2.142-5.8-5.625-5.8M209.083 4.99h-3.713v4.545h-3.008v3h3.008v11.28h3.713V12.541h3.008v-3h-3.008Zm-11.816 18.825h3.712V4.993h-3.712Zm-2.542-2.54v-7.168c0-3.17-2.2-4.8-6.168-4.8-4.426 0-6.368 2.2-6.682 4.655h3.57c.143-1.228 1.171-2.171 2.941-2.171 1.628 0 2.771.628 2.771 2.2 0 .713-.428.942-1.314 1.085l-3.57.514c-3.084.428-4.969 1.57-4.969 4.169s2.312 4.256 5.539 4.256a5.05 5.05 0 0 0 4.369-1.828v.144a8.2 8.2 0 0 0 .171 1.483h3.6v-.225a8.6 8.6 0 0 1-.257-2.313Zm-3.57-2.742a2.94 2.94 0 0 1-3.228 3.113c-1.6 0-2.911-.686-2.911-2.058 0-1.171.971-1.542 2.371-1.8l2.37-.484a2.28 2.28 0 0 0 1.4-.6Zm-27.843-13.54-3.253 14.951-3.427-14.951h-4.733l-3.427 14.951-3.254-14.951h-4l5.063 18.822h4.587l3.4-14.551 3.4 14.551h4.587l5.063-18.822Zm-28.059 4.344a4.83 4.83 0 0 0-4.454 2.284V9.538h-2.857v14.277h2.857v-8.223c0-2.6 1.228-4.284 3.655-4.284 2.284 0 3.455 1.428 3.455 3.941v8.566h2.856v-8.681c0-3.685-2.028-5.8-5.51-5.8M108.968 4.99h-2.857v4.545h-3.092V11.7h3.092v12.112h2.856V11.703h3.091V9.538h-3.088Zm-9.5 4.546-3.833 5.338-3.826-5.34h-3l5.111 6.854-5.111 7.423h3l3.826-5.8 3.826 5.8h2.97l-5.083-7.423 5.083-6.854Z" fill="#0B5D5F"/></svg>
      </div>
      <h2 style={{ fontFamily: "'FT Calhern', sans-serif", fontSize: mobile ? 20 : 24, fontWeight: 600, margin: "0 0 4px", color: "#0f2b2d" }}>{title}</h2>
      <p style={{ fontSize: 14, color: "#5e7a80", margin: 0 }}>{subtitle}</p>
    </div>
  );
}

export default function ConsultationBooking() {
  const mobile = useIsMobile();
  const today = new Date();
  const userTZ = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const isUAE = userTZ === UAE_TZ;

  const [step, setStep] = useState(1);
  const [cMonth, setCMonth] = useState(today.getMonth());
  const [cYear, setCYear] = useState(today.getFullYear());
  const [selSlot, setSelSlot] = useState(null);
  const [selDate, setSelDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [debug, setDebug] = useState(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", country: "", phoneCC: "AE",
    phone: "", service: "", fundSize: "", extra: ""
  });

  const resCountry = COUNTRIES.find((c) => c.name === form.country);
  const phoneCountry = COUNTRIES.find((c) => c.code === form.phoneCC);
  const dial = phoneCountry?.dial || "+971";
  const calDays = useMemo(() => getCalendarDays(cYear, cMonth), [cYear, cMonth]);
  const monthLabel = new Date(cYear, cMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // ─── FIX #1: Filter past time slots for today's date ───
  const timeSlots = useMemo(() => {
    if (!selDate) return [];
    const now = new Date();
    return UAE_SLOTS_RAW
      .map((s) => {
        const utc = uaeDateToUTC(selDate.year, selDate.month, selDate.day, s.h, s.m);
        const localTime = fmtTime(utc, userTZ);
        const uaeTime = `${String(s.h).padStart(2,"0")}:${String(s.m).padStart(2,"0")}`;
        const localDate = fmtDateISO(utc, userTZ);
        const uaeDate = `${selDate.year}-${String(selDate.month + 1).padStart(2,"0")}-${String(selDate.day).padStart(2,"0")}`;
        return { utc, localTime, uaeTime, localDate, uaeDate, key: uaeTime };
      })
      .filter((slot) => slot.utc > now);
  }, [selDate, userTZ]);

  const prevM = () => {
    if (cMonth === 0) { setCMonth(11); setCYear(cYear - 1); }
    else setCMonth(cMonth - 1);
  };
  const nextM = () => {
    if (cMonth === 11) { setCMonth(0); setCYear(cYear + 1); }
    else setCMonth(cMonth + 1);
  };

  const clickDate = (day) => {
    if (!day || !isWeekday(cYear, cMonth, day) || isPast(cYear, cMonth, day)) return;
    setSelDate({ year: cYear, month: cMonth, day });
    setSelSlot(null);
  };

  const upd = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: null }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!selDate) e.date = "Please select a date";
    if (!selSlot) e.time = "Please select a time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── FIX #7: Phone number min-length validation ───
  const validateStep2 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.country) e.country = "Required";
    const phone = form.phone.trim();
    if (!phone) {
      e.phone = "Required";
    } else if (phone.length < MIN_PHONE_LENGTH) {
      e.phone = `Must be at least ${MIN_PHONE_LENGTH} digits`;
    } else if (phone.length > MAX_PHONE_LENGTH) {
      e.phone = `Must be at most ${MAX_PHONE_LENGTH} digits`;
    }
    if (!form.service) e.service = "Required";
    if (!form.fundSize) e.fundSize = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goStep2 = () => {
    if (validateStep1()) { setErrors({}); setStep(2); }
  };

  // ─── FIX #2: Gate debug payload behind NODE_ENV ───
  const handleSubmit = () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    const payload = {
      first_name: form.firstName.trim(), last_name: form.lastName.trim(),
      country: form.country, country_code: resCountry?.code || "",
      phone_country_code: form.phoneCC, dial_code: dial,
      phone: `${dial}${form.phone.trim()}`, phone_raw: form.phone.trim(),
      service_interest: form.service, fund_size: form.fundSize,
      extra_questions: form.extra.trim(),
      // UAE (adviser) time
      uae_date: selSlot.uaeDate,
      uae_time: selSlot.uaeTime,
      uae_datetime: `${selSlot.uaeDate}T${selSlot.uaeTime}:00+04:00`,
      // Client local time
      local_date: selSlot.localDate,
      local_time: selSlot.localTime,
      local_datetime: `${selSlot.localDate}T${selSlot.localTime}:00`,
      local_timezone: userTZ,
      // UTC ISO
      utc_datetime: selSlot.utc.toISOString(),
    };
    if (IS_DEV) {
      console.log("Payload:", JSON.stringify(payload, null, 2));
      setDebug(payload);
    }
    setTimeout(() => { setSubmitted(true); setSubmitting(false); }, 800);
  };

  const reset = () => {
    setSubmitted(false);
    setDebug(null);
    setStep(1);
    setForm({ firstName: "", lastName: "", country: "", phoneCC: "AE", phone: "", service: "", fundSize: "", extra: "" });
    setSelDate(null);
    setSelSlot(null);
    setErrors({});
  };

  // Pretty format the selected date in user's local timezone
  const fmtSelectedLocal = () => {
    if (!selSlot) return "";
    return selSlot.utc.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: userTZ });
  };

  const fmtSelectedUAE = () => {
    if (!selSlot) return "";
    return selSlot.utc.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: UAE_TZ });
  };

  // Build an aria-label for a calendar day
  const dayAriaLabel = (day) => {
    const date = new Date(cYear, cMonth, day);
    const label = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const wk = isWeekday(cYear, cMonth, day);
    const past = isPast(cYear, cMonth, day);
    if (!wk) return `${label}, weekend, unavailable`;
    if (past) return `${label}, past date, unavailable`;
    return label;
  };

  // ─── SUCCESS ───
  if (submitted) {
    return (
      <div style={S.wrapper}>
        <div style={{ ...S.card, textAlign: "center", padding: mobile ? "40px 20px" : "60px 32px" }}>
          <div style={S.successIcon} aria-hidden="true">✓</div>
          <h2 style={{ fontFamily: "'FT Calhern', sans-serif", fontSize: mobile ? 20 : 24, fontWeight: 600, color: "#0f2b2d", margin: "0 0 12px" }}>Consultation Booked</h2>
          <p style={{ fontSize: mobile ? 14 : 15, color: "#3d5a5e", margin: "0 0 8px", lineHeight: 1.6 }}>
            Thank you, {form.firstName}. Your {form.service.toLowerCase()} consultation is booked for{" "}
            <strong>{fmtSelectedLocal()}</strong> at <strong>{selSlot.localTime}</strong> ({friendlyTZ(userTZ)} time).
          </p>
          {!isUAE && (
            <p style={{ fontSize: 13, color: "#7a9499", margin: "4px 0 0" }}>
              That's {selSlot.uaeTime} Dubai time for our advisers.
            </p>
          )}
          <p style={{ fontSize: 13, color: "#7a9499", margin: "12px 0 0" }}>We'll be in touch shortly with further details.</p>
          {IS_DEV && debug && (
            <div style={S.debugBox}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#0B5D5F", margin: "0 0 6px", textTransform: "uppercase" }}>Debug: Payload</p>
              <pre style={{ fontSize: 10, color: "#1a2e35", margin: 0, textAlign: "left", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(debug, null, 2)}</pre>
            </div>
          )}
          <button onClick={reset} style={{ ...S.btnPrimary, marginTop: 20 }}>← Book Another</button>
        </div>
      </div>
    );
  }

  // ─── STEP 1: PICK A TIME ───
  if (step === 1) {
    return (
      <div style={S.wrapper}>
        <div style={{ ...S.card, padding: mobile ? "24px 16px" : "32px 36px" }}>
          <Header title="Book a Free Consultation" subtitle="30 min · Choose a date and time that works for you" mobile={mobile} />
          <StepBar step={step} />

          {/* Timezone notice */}
          <div style={S.tzBanner}>
            🌐 Showing times in <strong>{friendlyTZ(userTZ)}</strong> time ({getTZLabel(userTZ)})
            {!isUAE && <span style={{ color: "#7a9499" }}> · Our office is in Dubai ({getTZLabel(UAE_TZ)})</span>}
          </div>

          <div style={{ display: "flex", gap: 28, flexDirection: mobile ? "column" : "row" }}>
            {/* Calendar */}
            <div style={{ flex: "1 1 280px" }} role="group" aria-label="Date picker">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <button onClick={prevM} style={S.navBtn} aria-label="Previous month">‹</button>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#0f2b2d" }} aria-live="polite">{monthLabel}</span>
                <button onClick={nextM} style={S.navBtn} aria-label="Next month">›</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }} role="row">
                {DAYS_HEADER.map((d) => (
                  <div key={d} role="columnheader" style={{ fontSize: 10, fontWeight: 700, color: "#7a9499", textAlign: "center", padding: "4px 0", letterSpacing: "0.05em" }}>{d}</div>
                ))}
              </div>
              {/* ─── FIX #3: Calendar days use <button> for keyboard accessibility ─── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }} role="grid" aria-label="Calendar">
                {calDays.map((day, i) => {
                  if (!day) return <div key={`e${i}`} style={S.calCell} role="gridcell" />;
                  const wk = isWeekday(cYear, cMonth, day);
                  const past = isPast(cYear, cMonth, day);
                  const td = isToday(cYear, cMonth, day);
                  const sel = selDate && selDate.year === cYear && selDate.month === cMonth && selDate.day === day;
                  const off = !wk || past;
                  return (
                    <button
                      key={`d${day}`}
                      role="gridcell"
                      aria-label={dayAriaLabel(day)}
                      aria-selected={sel || undefined}
                      aria-disabled={off || undefined}
                      disabled={off}
                      onClick={() => clickDate(day)}
                      style={{
                        ...S.calCellBtn,
                        fontWeight: 500,
                        transition: "background 0.15s, color 0.15s, border-color 0.15s",
                        ...(off ? { color: "#c5d0d3", cursor: "default" } : { cursor: "pointer", color: "#0f2b2d" }),
                        ...(sel ? { background: "#0B5D5F", color: "#fff", fontWeight: 700 } : {}),
                        ...(td && !sel ? { border: "2px solid #0B5D5F" } : {}),
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              {/* ─── FIX #6: aria-live error announcements ─── */}
              <div aria-live="polite" role="status">
                {!selDate && errors.date && <span style={{ ...S.err, marginTop: 8, display: "block" }}>Please select a date</span>}
              </div>
            </div>

            {/* Time Slots */}
            <div style={{ flex: "1 1 240px" }} role="group" aria-label="Time slot picker">
              {selDate ? (
                <>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#3d5a5e", margin: "0 0 12px" }}>
                    Available times for{" "}
                    {new Date(selDate.year, selDate.month, selDate.day).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
                  </p>
                  <div aria-live="polite" role="status">
                    {errors.time && <span style={S.err}>{errors.time}</span>}
                  </div>
                  {timeSlots.length === 0 ? (
                    <p style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", marginTop: 24 }}>
                      No available time slots remaining for today. Please select another date.
                    </p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {timeSlots.map((slot) => {
                        const selected = selSlot && selSlot.key === slot.key;
                        return (
                          <button
                            key={slot.key}
                            aria-label={`Book ${slot.localTime} ${friendlyTZ(userTZ)} time`}
                            aria-pressed={selected}
                            onClick={() => { setSelSlot(slot); setErrors((p) => ({ ...p, time: null, date: null })); }}
                            style={{
                              padding: "8px 4px", border: "1.5px solid #d1dde0", borderRadius: 8,
                              background: selected ? "#0B5D5F" : "#fff", fontSize: 13, fontWeight: 500,
                              color: selected ? "#fff" : "#0B5D5F", cursor: "pointer", transition: "background 0.15s, color 0.15s, border-color 0.15s",
                              textAlign: "center", borderColor: selected ? "#0B5D5F" : "#d1dde0", lineHeight: 1.4,
                            }}
                          >
                            {slot.localTime}
                            {!isUAE && <span style={{ display: "block", fontSize: 9, opacity: 0.7, marginTop: 2 }}>{slot.uaeTime} Dubai</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200 }}>
                  <p style={{ fontSize: 14, color: "#94a3b8", textAlign: "center" }}>← Select a date to see<br/>available time slots</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid #e4eaec" }}>
            <button onClick={goStep2} style={{ ...S.btnPrimary, width: mobile ? "100%" : "auto" }}>Continue to Details →</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2: YOUR DETAILS ───
  // ─── FIX #5: Associate labels with inputs via id/htmlFor ───
  // ─── FIX #6: aria-invalid + aria-describedby for error announcements ───
  return (
    <div style={S.wrapper}>
      <div style={{ ...S.card, padding: mobile ? "24px 16px" : "32px 36px" }}>
        <Header title="Your Details" subtitle="Almost done — tell us a bit about yourself" mobile={mobile} />
        <StepBar step={step} />

        {/* Selected time chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          <span style={S.chip}>📅 {fmtSelectedLocal()}</span>
          <span style={S.chip}>🕐 {selSlot.localTime} ({friendlyTZ(userTZ)})</span>
          {!isUAE && <span style={{ ...S.chip, background: "#fff", borderColor: "#d1dde0", color: "#7a9499" }}>🇦🇪 {selSlot.uaeTime} Dubai</span>}
        </div>

        {/* Aria-live region for form errors */}
        <div aria-live="polite" role="status" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
          {Object.values(errors).filter(Boolean).length > 0 && (
            <span>Please fix the following errors: {Object.entries(errors).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(", ")}</span>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <div style={mobile ? S.fieldFull : S.fieldHalf}>
            <label htmlFor="field-firstName" style={S.label}>First Name *</label>
            <input
              id="field-firstName"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "err-firstName" : undefined}
              style={{ ...S.input, ...(errors.firstName ? S.inputErr : {}) }}
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => upd("firstName", e.target.value)}
            />
            {errors.firstName && <span id="err-firstName" style={S.err} role="alert">{errors.firstName}</span>}
          </div>
          <div style={mobile ? S.fieldFull : S.fieldHalf}>
            <label htmlFor="field-lastName" style={S.label}>Last Name *</label>
            <input
              id="field-lastName"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "err-lastName" : undefined}
              style={{ ...S.input, ...(errors.lastName ? S.inputErr : {}) }}
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => upd("lastName", e.target.value)}
            />
            {errors.lastName && <span id="err-lastName" style={S.err} role="alert">{errors.lastName}</span>}
          </div>
          <div style={S.fieldFull}>
            <label htmlFor="field-country" style={S.label}>Country of Residence *</label>
            <select
              id="field-country"
              autoComplete="country-name"
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "err-country" : undefined}
              style={{ ...S.select, ...(errors.country ? S.inputErr : {}), color: form.country ? "#1a2e35" : "#94a3b8" }}
              value={form.country}
              onChange={(e) => upd("country", e.target.value)}
            >
              <option value="" disabled>Select country</option>
              {COUNTRIES.map((c) => <option key={c.code} value={c.name}>{FLAG(c.code)} {c.name}</option>)}
            </select>
            {errors.country && <span id="err-country" style={S.err} role="alert">{errors.country}</span>}
          </div>
          <div style={S.fieldFull}>
            <label htmlFor="field-phone" style={S.label}>Mobile Number *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select
                id="field-phoneCC"
                aria-label="Phone country code"
                style={{ ...S.select, flex: mobile ? "0 0 110px" : "0 0 130px", width: mobile ? 110 : 130 }}
                value={form.phoneCC}
                onChange={(e) => upd("phoneCC", e.target.value)}
              >
                {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{FLAG(c.code)} {c.dial}</option>)}
              </select>
              <input
                id="field-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                style={{ ...S.input, flex: 1, ...(errors.phone ? S.inputErr : {}) }}
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => upd("phone", e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={MAX_PHONE_LENGTH}
              />
            </div>
            {errors.phone && <span id="err-phone" style={S.err} role="alert">{errors.phone}</span>}
          </div>
          <div style={mobile ? S.fieldFull : S.fieldHalf}>
            <label htmlFor="field-service" style={S.label}>How Can We Assist You? *</label>
            <select
              id="field-service"
              aria-invalid={!!errors.service}
              aria-describedby={errors.service ? "err-service" : undefined}
              style={{ ...S.select, ...(errors.service ? S.inputErr : {}), color: form.service ? "#1a2e35" : "#94a3b8" }}
              value={form.service}
              onChange={(e) => upd("service", e.target.value)}
            >
              <option value="" disabled>Select a service</option>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.service && <span id="err-service" style={S.err} role="alert">{errors.service}</span>}
          </div>
          <div style={mobile ? S.fieldFull : S.fieldHalf}>
            <label htmlFor="field-fundSize" style={S.label}>Current Size of Fund *</label>
            <select
              id="field-fundSize"
              aria-invalid={!!errors.fundSize}
              aria-describedby={errors.fundSize ? "err-fundSize" : undefined}
              style={{ ...S.select, ...(errors.fundSize ? S.inputErr : {}), color: form.fundSize ? "#1a2e35" : "#94a3b8" }}
              value={form.fundSize}
              onChange={(e) => upd("fundSize", e.target.value)}
            >
              <option value="" disabled>Select fund size</option>
              {FUND_SIZES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            {errors.fundSize && <span id="err-fundSize" style={S.err} role="alert">{errors.fundSize}</span>}
          </div>
          <div style={S.fieldFull}>
            <label htmlFor="field-extra" style={S.label}>Additional Information <span style={{ fontWeight: 400, textTransform: "none", color: "#94a3b8", letterSpacing: 0 }}>(optional)</span></label>
            <textarea
              id="field-extra"
              style={S.textarea}
              rows={3}
              placeholder="Anything else you'd like us to know?"
              value={form.extra}
              onChange={(e) => upd("extra", e.target.value)}
              maxLength={1000}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid #e4eaec", flexWrap: "wrap", gap: 12, flexDirection: mobile ? "column-reverse" : "row" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: mobile ? "stretch" : "flex-end", gap: 4, width: mobile ? "100%" : "auto" }}>
            <button onClick={handleSubmit} disabled={submitting}
              style={{ ...S.btnPrimary, ...(submitting ? { opacity: 0.6, cursor: "not-allowed" } : {}), width: mobile ? "100%" : "auto" }}>
              {submitting ? "Submitting..." : "Confirm Booking →"}
            </button>
            <p style={{ fontSize: 10, color: "#7a9499", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, textAlign: mobile ? "center" : "right" }}>
              By submitting you agree to our <a href="https://hoxtonwealth.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#0B5D5F", textDecoration: "underline" }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FIX #4: Focus indicators restored ───
const focusRing = "0 0 0 2px #0B5D5F";

const S = {
  wrapper: { fontFamily: "'Sentient', Georgia, serif", maxWidth: 780, margin: "0 auto", padding: "20px 12px", color: "#1a2e35" },
  card: { background: "#fff", borderRadius: 14, border: "1px solid #e4eaec", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  fieldHalf: { flex: "1 1 calc(50% - 8px)", minWidth: 200, display: "flex", flexDirection: "column" },
  fieldFull: { flex: "1 1 100%", display: "flex", flexDirection: "column" },
  label: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#3d5a5e", marginBottom: 6 },
  input: { padding: "11px 12px", border: "1.5px solid #d1dde0", borderRadius: 8, fontSize: 14, color: "#1a2e35", background: "#fff", boxSizing: "border-box", width: "100%", transition: "border 0.2s, box-shadow 0.2s" },
  inputErr: { borderColor: "#e05252" },
  select: { padding: "11px 12px", border: "1.5px solid #d1dde0", borderRadius: 8, fontSize: 14, background: "#fff", cursor: "pointer", boxSizing: "border-box", width: "100%" },
  textarea: { padding: "11px 12px", border: "1.5px solid #d1dde0", borderRadius: 8, fontSize: 14, color: "#1a2e35", resize: "vertical", fontFamily: "inherit", background: "#fff", boxSizing: "border-box", width: "100%" },
  err: { fontSize: 11, color: "#e05252", marginTop: 4 },
  btnPrimary: { padding: "12px 28px", background: "#0B5D5F", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontFamily: "'FT Calhern', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em", transition: "background 0.2s" },
  btnSecondary: { padding: "12px 20px", background: "none", color: "#0B5D5F", border: "1.5px solid #d1dde0", borderRadius: 8, fontSize: 14, fontFamily: "'FT Calhern', sans-serif", fontWeight: 600, cursor: "pointer" },
  stepDot: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, border: "2px solid #d1dde0", color: "#94a3b8", background: "#fff", transition: "background 0.2s, color 0.2s, border-color 0.2s" },
  stepDotActive: { borderColor: "#0B5D5F", background: "#0B5D5F", color: "#fff" },
  chip: { padding: "6px 14px", background: "#f0f5f5", borderRadius: 20, fontSize: 13, fontWeight: 500, color: "#0B5D5F", border: "1px solid #d6e5e5" },
  calCell: { aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, borderRadius: "50%" },
  calCellBtn: { aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, borderRadius: "50%", border: "2px solid transparent", background: "none", padding: 0 },
  navBtn: { background: "none", border: "1.5px solid #d1dde0", borderRadius: 8, width: 34, height: 34, fontSize: 18, cursor: "pointer", color: "#0B5D5F", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  successIcon: { width: 56, height: 56, borderRadius: "50%", background: "#0B5D5F", color: "#fff", fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  debugBox: { marginTop: 20, padding: 16, background: "#eef4f5", borderRadius: 8, border: "1px solid #d1dde0", maxWidth: 480, marginLeft: "auto", marginRight: "auto" },
  tzBanner: { fontSize: 13, color: "#3d5a5e", background: "#f0f7f7", border: "1px solid #d6e5e5", borderRadius: 8, padding: "10px 14px", marginBottom: 24 },
};
