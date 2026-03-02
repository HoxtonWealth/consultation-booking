import { useState, useMemo } from "react";
import { getCalendarDays, isWeekday, isPastDate, isToday } from "../utils/calendar";
import { DAYS_HEADER } from "../data/constants";
import { styles } from "../styles";

export function CalendarPicker({ selectedDate, onSelectDate, errors }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const calendarDays = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    if (!day || !isWeekday(currentYear, currentMonth, day) || isPastDate(currentYear, currentMonth, day)) return;
    onSelectDate({ year: currentYear, month: currentMonth, day });
  };

  const getDayAriaLabel = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const label = date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!isWeekday(currentYear, currentMonth, day)) return `${label}, weekend, unavailable`;
    if (isPastDate(currentYear, currentMonth, day)) return `${label}, past date, unavailable`;
    return label;
  };

  return (
    <div style={{ flex: "1 1 280px" }} role="group" aria-label="Date picker">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={goToPreviousMonth} style={styles.navButton} aria-label="Previous month">‹</button>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#0f2b2d" }} aria-live="polite">{monthLabel}</span>
        <button onClick={goToNextMonth} style={styles.navButton} aria-label="Next month">›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }} role="row">
        {DAYS_HEADER.map((dayName) => (
          <div key={dayName} role="columnheader" style={{ fontSize: 10, fontWeight: 700, color: "#7a9499", textAlign: "center", padding: "4px 0", letterSpacing: "0.05em" }}>
            {dayName}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }} role="grid" aria-label="Calendar">
        {calendarDays.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} style={styles.calendarCell} role="gridcell" />;
          const weekday = isWeekday(currentYear, currentMonth, day);
          const past = isPastDate(currentYear, currentMonth, day);
          const todayHighlight = isToday(currentYear, currentMonth, day);
          const isSelected = selectedDate && selectedDate.year === currentYear && selectedDate.month === currentMonth && selectedDate.day === day;
          const isDisabled = !weekday || past;
          return (
            <button
              key={`day-${day}`}
              role="gridcell"
              aria-label={getDayAriaLabel(day)}
              aria-selected={isSelected || undefined}
              aria-disabled={isDisabled || undefined}
              disabled={isDisabled}
              onClick={() => handleDateClick(day)}
              style={{
                ...styles.calendarCellButton,
                fontWeight: 500,
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
                ...(isDisabled ? { color: "#c5d0d3", cursor: "default" } : { cursor: "pointer", color: "#0f2b2d" }),
                ...(isSelected ? { background: "#0B5D5F", color: "#fff", fontWeight: 700 } : {}),
                ...(todayHighlight && !isSelected ? { border: "2px solid #0B5D5F" } : {}),
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div aria-live="polite" role="status">
        {!selectedDate && errors?.date && (
          <span style={{ ...styles.errorText, marginTop: 8, display: "block" }}>Please select a date</span>
        )}
      </div>
    </div>
  );
}
