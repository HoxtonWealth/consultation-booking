import { useMemo } from "react";
import { UAE_SLOT_HOURS, uaeDateToUTC, formatTime, formatDateISO, friendlyTimezone } from "../utils/timezone";
import { styles } from "../styles";

export function TimeSlotGrid({ selectedDate, selectedSlot, onSelectSlot, userTimezone, isUAE, errors }) {
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const now = new Date();
    return UAE_SLOT_HOURS
      .map((slot) => {
        const utcDate = uaeDateToUTC(selectedDate.year, selectedDate.month, selectedDate.day, slot.hour, slot.minute);
        const localTime = formatTime(utcDate, userTimezone);
        const uaeTime = `${String(slot.hour).padStart(2, "0")}:${String(slot.minute).padStart(2, "0")}`;
        const localDate = formatDateISO(utcDate, userTimezone);
        const uaeDate = `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;
        return { utc: utcDate, localTime, uaeTime, localDate, uaeDate, key: uaeTime };
      })
      .filter((slot) => slot.utc > now);
  }, [selectedDate, userTimezone]);

  if (!selectedDate) {
    return (
      <div style={{ flex: "1 1 240px" }} role="group" aria-label="Time slot picker">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200 }}>
          <p style={{ fontSize: 14, color: "#94a3b8", textAlign: "center" }}>← Select a date to see<br />available time slots</p>
        </div>
      </div>
    );
  }

  const dateLabel = new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div style={{ flex: "1 1 240px" }} role="group" aria-label="Time slot picker">
      <p style={{ fontSize: 13, fontWeight: 600, color: "#3d5a5e", margin: "0 0 12px" }}>
        Available times for {dateLabel}
      </p>
      <div aria-live="polite" role="status">
        {errors?.time && <span style={styles.errorText}>{errors.time}</span>}
      </div>
      {timeSlots.length === 0 ? (
        <p style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", marginTop: 24 }}>
          No available time slots remaining for today. Please select another date.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {timeSlots.map((slot) => {
            const isSelected = selectedSlot && selectedSlot.key === slot.key;
            return (
              <button
                key={slot.key}
                aria-label={`Book ${slot.localTime} ${friendlyTimezone(userTimezone)} time`}
                aria-pressed={isSelected}
                onClick={() => onSelectSlot(slot)}
                style={{
                  padding: "8px 4px",
                  border: "1.5px solid #d1dde0",
                  borderRadius: 8,
                  background: isSelected ? "#0B5D5F" : "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  color: isSelected ? "#fff" : "#0B5D5F",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s, border-color 0.15s",
                  textAlign: "center",
                  borderColor: isSelected ? "#0B5D5F" : "#d1dde0",
                  lineHeight: 1.4,
                }}
              >
                {slot.localTime}
                {!isUAE && (
                  <span style={{ display: "block", fontSize: 9, opacity: 0.7, marginTop: 2 }}>
                    {slot.uaeTime} Dubai
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
