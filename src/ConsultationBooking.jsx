import { useState, useMemo, useEffect, useRef } from "react";
import { useIsMobile } from "./hooks/useIsMobile";
import { COUNTRIES } from "./data/countries";
import { MIN_PHONE_LENGTH, MAX_PHONE_LENGTH, IS_DEV } from "./data/constants";
import { UAE_TZ, friendlyTimezone, getTimezoneLabel } from "./utils/timezone";
import { StepBar } from "./components/StepBar";
import { Header } from "./components/Header";
import { CalendarPicker } from "./components/CalendarPicker";
import { TimeSlotGrid } from "./components/TimeSlotGrid";
import { BookingForm } from "./components/BookingForm";
import { SuccessScreen } from "./components/SuccessScreen";
import { styles } from "./styles";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  phoneCC: "AE",
  phone: "",
  service: "",
  fundSize: "",
  extra: "",
};

export default function ConsultationBooking() {
  const isMobile = useIsMobile();
  const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const isUAE = userTimezone === UAE_TZ;

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [debug, setDebug] = useState(null);

  // Capture UTM params on mount
  const utmRef = useRef({});
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const utmValues = {};
    utmKeys.forEach((key) => {
      const value = params.get(key);
      if (value) utmValues[key] = value;
    });
    utmRef.current = utmValues;
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setErrors((prev) => ({ ...prev, time: null, date: null }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!selectedDate) newErrors.date = "Please select a date";
    if (!selectedSlot) newErrors.time = "Please select a time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim()) {
      newErrors.email = "Required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Must contain @";
    }
    if (!form.country) newErrors.country = "Required";
    const phone = form.phone.trim();
    if (!phone) {
      newErrors.phone = "Required";
    } else if (phone.length < MIN_PHONE_LENGTH) {
      newErrors.phone = `Must be at least ${MIN_PHONE_LENGTH} digits`;
    } else if (phone.length > MAX_PHONE_LENGTH) {
      newErrors.phone = `Must be at most ${MAX_PHONE_LENGTH} digits`;
    }
    if (!form.service) newErrors.service = "Required";
    if (!form.fundSize) newErrors.fundSize = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const proceedToStep2 = () => {
    if (validateStep1()) {
      setErrors({});
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    setSubmitError(null);

    const residenceCountry = COUNTRIES.find((c) => c.name === form.country);
    const phoneCountry = COUNTRIES.find((c) => c.code === form.phoneCC);
    const dialCode = phoneCountry?.dial || "+971";

    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      country: form.country,
      country_code: residenceCountry?.code || "",
      phone_country_code: form.phoneCC,
      dial_code: dialCode,
      phone: `${dialCode}${form.phone.trim()}`,
      phone_raw: form.phone.trim(),
      service_interest: form.service,
      fund_size: form.fundSize,
      extra_questions: form.extra.trim(),
      uae_date: selectedSlot.uaeDate,
      uae_time: selectedSlot.uaeTime,
      uae_datetime: `${selectedSlot.uaeDate}T${selectedSlot.uaeTime}:00+04:00`,
      local_date: selectedSlot.localDate,
      local_time: selectedSlot.localTime,
      local_datetime: `${selectedSlot.localDate}T${selectedSlot.localTime}:00`,
      local_timezone: userTimezone,
      utc_datetime: selectedSlot.utc.toISOString(),
      utm: utmRef.current,
    };

    if (IS_DEV) {
      console.log("Payload:", JSON.stringify(payload, null, 2));
      setDebug(payload);
    }

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${response.status})`);
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Booking submission error:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setSubmitted(false);
    setSubmitError(null);
    setDebug(null);
    setStep(1);
    setForm(INITIAL_FORM_STATE);
    setSelectedDate(null);
    setSelectedSlot(null);
    setErrors({});
  };

  // ─── SUCCESS SCREEN ───
  if (submitted) {
    return (
      <SuccessScreen
        form={form}
        selectedSlot={selectedSlot}
        userTimezone={userTimezone}
        isUAE={isUAE}
        debug={debug}
        onReset={resetBooking}
        isMobile={isMobile}
      />
    );
  }

  // ─── STEP 1: PICK A TIME ───
  if (step === 1) {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.card, padding: isMobile ? "24px 16px" : "32px 36px" }}>
          <Header title="Book a Free Consultation" subtitle="30 min · Choose a date and time that works for you" isMobile={isMobile} />
          <StepBar step={step} />

          <div style={styles.timezoneBanner}>
            🌐 Showing times in <strong>{friendlyTimezone(userTimezone)}</strong> time ({getTimezoneLabel(userTimezone)})
          </div>

          <div style={{ display: "flex", gap: 28, flexDirection: isMobile ? "column" : "row" }}>
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              errors={errors}
            />
            <TimeSlotGrid
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={handleSelectSlot}
              userTimezone={userTimezone}
              isUAE={isUAE}
              errors={errors}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid #e4eaec" }}>
            <button onClick={proceedToStep2} style={{ ...styles.btnPrimary, width: isMobile ? "100%" : "auto" }}>
              Continue to Details →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2: YOUR DETAILS ───
  const formattedSelectedDate = selectedSlot
    ? selectedSlot.utc.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: userTimezone })
    : "";

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.card, padding: isMobile ? "24px 16px" : "32px 36px" }}>
        <Header title="Your Details" subtitle="Almost done — tell us a bit about yourself" isMobile={isMobile} />
        <StepBar step={step} />

        {/* Selected time chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          <span style={styles.chip}>📅 {formattedSelectedDate}</span>
          <span style={styles.chip}>🕐 {selectedSlot.localTime} ({friendlyTimezone(userTimezone)})</span>
          {!isUAE && (
            <span style={{ ...styles.chip, background: "#fff", borderColor: "#d1dde0", color: "#7a9499" }}>
              🇦🇪 {selectedSlot.uaeTime} Dubai
            </span>
          )}
        </div>

        {/* Aria-live region for form errors */}
        <div aria-live="polite" role="status" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
          {Object.values(errors).filter(Boolean).length > 0 && (
            <span>
              Please fix the following errors: {Object.entries(errors).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(", ")}
            </span>
          )}
        </div>

        <BookingForm
          form={form}
          onUpdateField={updateField}
          errors={errors}
          isMobile={isMobile}
        />

        {submitError && (
          <div role="alert" style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#dc2626" }}>
            {submitError}
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid #e4eaec",
          flexWrap: "wrap",
          gap: 12,
          flexDirection: isMobile ? "column-reverse" : "row",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "stretch" : "flex-end", gap: 4, width: isMobile ? "100%" : "auto" }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ ...styles.btnPrimary, ...(submitting ? { opacity: 0.6, cursor: "not-allowed" } : {}), width: isMobile ? "100%" : "auto" }}
            >
              {submitting ? "Submitting..." : "Confirm Booking →"}
            </button>
            <p style={{ fontSize: 10, color: "#7a9499", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, textAlign: isMobile ? "center" : "right" }}>
              By submitting you agree to our{" "}
              <a href="https://hoxtonwealth.com/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#0B5D5F", textDecoration: "underline" }}>
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
