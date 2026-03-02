import { friendlyTimezone, UAE_TZ } from "../utils/timezone";
import { IS_DEV } from "../data/constants";
import { styles } from "../styles";

export function SuccessScreen({ form, selectedSlot, userTimezone, isUAE, debug, onReset, isMobile }) {
  const formattedDate = selectedSlot.utc.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: userTimezone,
  });

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.card, textAlign: "center", padding: isMobile ? "40px 20px" : "60px 32px" }}>
        <div style={styles.successIcon} aria-hidden="true">✓</div>
        <h2 style={{ fontFamily: "'FT Calhern', sans-serif", fontSize: isMobile ? 20 : 24, fontWeight: 600, color: "#0f2b2d", margin: "0 0 12px" }}>
          Consultation Booked
        </h2>
        <p style={{ fontSize: isMobile ? 14 : 15, color: "#3d5a5e", margin: "0 0 8px", lineHeight: 1.6 }}>
          Thank you, {form.firstName}. Your {form.service.toLowerCase()} consultation is booked for{" "}
          <strong>{formattedDate}</strong> at <strong>{selectedSlot.localTime}</strong> ({friendlyTimezone(userTimezone)} time).
        </p>
        {!isUAE && (
          <p style={{ fontSize: 13, color: "#7a9499", margin: "4px 0 0" }}>
            That's {selectedSlot.uaeTime} Dubai time for our advisers.
          </p>
        )}
        <p style={{ fontSize: 13, color: "#7a9499", margin: "12px 0 0" }}>
          We'll be in touch shortly with further details.
        </p>
        {IS_DEV && debug && (
          <div style={styles.debugBox}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#0B5D5F", margin: "0 0 6px", textTransform: "uppercase" }}>
              Debug: Payload
            </p>
            <pre style={{ fontSize: 10, color: "#1a2e35", margin: 0, textAlign: "left", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {JSON.stringify(debug, null, 2)}
            </pre>
          </div>
        )}
        <button onClick={onReset} style={{ ...styles.btnPrimary, marginTop: 20 }}>← Book Another</button>
      </div>
    </div>
  );
}
