import { COUNTRIES, countryFlag } from "../data/countries";
import { SERVICES, FUND_SIZES, MAX_PHONE_LENGTH } from "../data/constants";
import { styles } from "../styles";

export function BookingForm({ form, onUpdateField, errors, isMobile }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {/* First Name */}
      <div style={isMobile ? styles.fieldFull : styles.fieldHalf}>
        <label htmlFor="field-firstName" style={styles.label}>First Name *</label>
        <input
          id="field-firstName"
          autoComplete="given-name"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? "err-firstName" : undefined}
          style={{ ...styles.input, ...(errors.firstName ? styles.inputError : {}) }}
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => onUpdateField("firstName", e.target.value)}
        />
        {errors.firstName && <span id="err-firstName" style={styles.errorText} role="alert">{errors.firstName}</span>}
      </div>

      {/* Last Name */}
      <div style={isMobile ? styles.fieldFull : styles.fieldHalf}>
        <label htmlFor="field-lastName" style={styles.label}>Last Name *</label>
        <input
          id="field-lastName"
          autoComplete="family-name"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? "err-lastName" : undefined}
          style={{ ...styles.input, ...(errors.lastName ? styles.inputError : {}) }}
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => onUpdateField("lastName", e.target.value)}
        />
        {errors.lastName && <span id="err-lastName" style={styles.errorText} role="alert">{errors.lastName}</span>}
      </div>

      {/* Email */}
      <div style={styles.fieldFull}>
        <label htmlFor="field-email" style={styles.label}>Email Address *</label>
        <input
          id="field-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
          style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => onUpdateField("email", e.target.value)}
        />
        {errors.email && <span id="err-email" style={styles.errorText} role="alert">{errors.email}</span>}
      </div>

      {/* Country */}
      <div style={styles.fieldFull}>
        <label htmlFor="field-country" style={styles.label}>Country of Residence *</label>
        <select
          id="field-country"
          autoComplete="country-name"
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? "err-country" : undefined}
          style={{ ...styles.select, ...(errors.country ? styles.inputError : {}), color: form.country ? "#1a2e35" : "#94a3b8" }}
          value={form.country}
          onChange={(e) => onUpdateField("country", e.target.value)}
        >
          <option value="" disabled>Select country</option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.name}>{countryFlag(country.code)} {country.name}</option>
          ))}
        </select>
        {errors.country && <span id="err-country" style={styles.errorText} role="alert">{errors.country}</span>}
      </div>

      {/* Phone */}
      <div style={styles.fieldFull}>
        <label htmlFor="field-phone" style={styles.label}>Mobile Number *</label>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            id="field-phoneCC"
            aria-label="Phone country code"
            style={{ ...styles.select, flex: isMobile ? "0 0 110px" : "0 0 130px", width: isMobile ? 110 : 130 }}
            value={form.phoneCC}
            onChange={(e) => onUpdateField("phoneCC", e.target.value)}
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>{countryFlag(country.code)} {country.dial}</option>
            ))}
          </select>
          <input
            id="field-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "err-phone" : undefined}
            style={{ ...styles.input, flex: 1, ...(errors.phone ? styles.inputError : {}) }}
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => onUpdateField("phone", e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={MAX_PHONE_LENGTH}
          />
        </div>
        {errors.phone && <span id="err-phone" style={styles.errorText} role="alert">{errors.phone}</span>}
      </div>

      {/* Service */}
      <div style={isMobile ? styles.fieldFull : styles.fieldHalf}>
        <label htmlFor="field-service" style={styles.label}>How Can We Assist You? *</label>
        <select
          id="field-service"
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? "err-service" : undefined}
          style={{ ...styles.select, ...(errors.service ? styles.inputError : {}), color: form.service ? "#1a2e35" : "#94a3b8" }}
          value={form.service}
          onChange={(e) => onUpdateField("service", e.target.value)}
        >
          <option value="" disabled>Select a service</option>
          {SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}
        </select>
        {errors.service && <span id="err-service" style={styles.errorText} role="alert">{errors.service}</span>}
      </div>

      {/* Fund Size */}
      <div style={isMobile ? styles.fieldFull : styles.fieldHalf}>
        <label htmlFor="field-fundSize" style={styles.label}>Current Size of Fund *</label>
        <select
          id="field-fundSize"
          aria-invalid={!!errors.fundSize}
          aria-describedby={errors.fundSize ? "err-fundSize" : undefined}
          style={{ ...styles.select, ...(errors.fundSize ? styles.inputError : {}), color: form.fundSize ? "#1a2e35" : "#94a3b8" }}
          value={form.fundSize}
          onChange={(e) => onUpdateField("fundSize", e.target.value)}
        >
          <option value="" disabled>Select fund size</option>
          {FUND_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
        {errors.fundSize && <span id="err-fundSize" style={styles.errorText} role="alert">{errors.fundSize}</span>}
      </div>

      {/* Extra */}
      <div style={styles.fieldFull}>
        <label htmlFor="field-extra" style={styles.label}>
          Additional Information <span style={{ fontWeight: 400, textTransform: "none", color: "#94a3b8", letterSpacing: 0 }}>(optional)</span>
        </label>
        <textarea
          id="field-extra"
          style={styles.textarea}
          rows={3}
          placeholder="Anything else you'd like us to know?"
          value={form.extra}
          onChange={(e) => onUpdateField("extra", e.target.value)}
          maxLength={1000}
        />
      </div>
    </div>
  );
}
