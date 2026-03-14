# HoxtonWealth Tool Template

Use this document as a blueprint when building new tools with the same branding, form patterns, and Ortto integration.

---

## 1. Brand & Visual Identity

### Company
- **Name**: HoxtonWealth
- **Logo**: SVG (embedded in Header component, 227x26 viewBox)
- **Logo Primary Color**: `#0B5D5F`
- **Favicon**: `/public/favicon.png`

### Color Palette

| Token           | Hex       | Usage                                  |
|-----------------|-----------|----------------------------------------|
| Primary Teal    | `#0B5D5F` | Buttons, active states, branding, logo |
| Dark Text       | `#1a2e35` | Body text, form inputs                 |
| Heading Text    | `#0f2b2d` | Headings                               |
| Label Text      | `#3d5a5e` | Form labels, secondary text            |
| Muted Text      | `#7a9499` | Placeholders, tertiary text            |
| Page Background | `#f5f7f8` | Page/body background                   |
| Card Background | `#ffffff` | Cards, inputs                          |
| Border Light    | `#e4eaec` | Card borders, section dividers         |
| Border Medium   | `#d1dde0` | Input borders, nav buttons             |
| Chip Background | `#f0f5f5` | Tags, chips                            |
| Chip Border     | `#d6e5e5` | Chip/banner borders                    |
| Banner Bg       | `#f0f7f7` | Info banners (e.g. timezone notice)    |
| Error Red       | `#e05252` | Error text, error borders              |
| Error Bg        | `#fef2f2` | Error backgrounds                      |

### Typography

| Family          | Weights         | Usage                  | Files                                            |
|-----------------|-----------------|------------------------|--------------------------------------------------|
| **FT Calhern**  | Medium (500), Semibold (600) | Headings, buttons | `FTCalhern-Medium.woff2`, `FTCalhern-Semibold.woff2` |
| **Sentient**    | Regular (400), Medium (500)  | Body text, forms  | `Sentient-Regular.woff2`, `Sentient-Medium.woff2`    |
| Georgia (serif) | -               | Fallback               | System font                                      |

**Font declarations (index.html)**:
```css
@font-face { font-family: "FT Calhern"; src: url("/fonts/FTCalhern-Semibold.woff2") format("woff2"); font-weight: 600; font-display: swap; }
@font-face { font-family: "FT Calhern"; src: url("/fonts/FTCalhern-Medium.woff2") format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Sentient"; src: url("/fonts/Sentient-Regular.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Sentient"; src: url("/fonts/Sentient-Medium.woff2") format("woff2"); font-weight: 500; font-display: swap; }
```

**Text styles**:
- Labels: 11px, weight 600, uppercase, letter-spacing 0.06em, color `#3d5a5e`
- Body/inputs: 14px, weight 400, color `#1a2e35`
- Buttons: 14px, weight 600, FT Calhern, letter-spacing 0.01em
- Headings: FT Calhern, weight 600

### Layout & Spacing

| Property             | Desktop     | Mobile (< 640px) |
|----------------------|-------------|-------------------|
| Max width            | 780px       | 100%              |
| Wrapper padding      | 20px 12px   | 20px 12px         |
| Card padding         | 32px h, 36px v | 24px h, 16px v |
| Card border-radius   | 14px        | 14px              |
| Input border-radius  | 8px         | 8px               |
| Input border         | 1.5px solid `#d1dde0` | same     |
| Input padding        | 11px 12px   | same              |
| Button border-radius | 8px         | 8px               |
| Button padding       | 12px 28px   | same              |
| Component gap        | 28px        | 28px              |
| Form field gap       | 16px        | 16px              |
| Logo width           | 200px       | 155px             |
| Title font size      | 24px        | 20px              |

### Accessibility

- Focus: 2px solid `#0B5D5F`, 2px offset
- Respects `prefers-reduced-motion`
- ARIA labels, roles, live regions on all interactive elements
- Color contrast meets WCAG AA

---

## 2. Inline Style Objects (styles.js)

Copy this file into new tools and adjust as needed:

```javascript
export const styles = {
  wrapper:    { fontFamily: "'Sentient', Georgia, serif", maxWidth: 780, margin: "0 auto", padding: "20px 12px", color: "#1a2e35" },
  card:       { background: "#fff", borderRadius: 14, border: "1px solid #e4eaec", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
  fieldHalf:  { flex: "1 1 calc(50% - 8px)", minWidth: 200, display: "flex", flexDirection: "column" },
  fieldFull:  { flex: "1 1 100%", display: "flex", flexDirection: "column" },
  label:      { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#3d5a5e", marginBottom: 6 },
  input:      { padding: "11px 12px", border: "1.5px solid #d1dde0", borderRadius: 8, fontSize: 14, color: "#1a2e35", background: "#fff", boxSizing: "border-box", width: "100%", transition: "border 0.2s, box-shadow 0.2s" },
  inputError: { borderColor: "#e05252" },
  select:     { padding: "11px 12px", border: "1.5px solid #d1dde0", borderRadius: 8, fontSize: 14, background: "#fff", cursor: "pointer", boxSizing: "border-box", width: "100%" },
  textarea:   { padding: "11px 12px", border: "1.5px solid #d1dde0", borderRadius: 8, fontSize: 14, color: "#1a2e35", resize: "vertical", fontFamily: "inherit", background: "#fff", boxSizing: "border-box", width: "100%" },
  errorText:  { fontSize: 11, color: "#e05252", marginTop: 4 },
  btnPrimary: { padding: "12px 28px", background: "#0B5D5F", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontFamily: "'FT Calhern', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.01em", transition: "background 0.2s" },
  chip:       { padding: "6px 14px", background: "#f0f5f5", borderRadius: 20, fontSize: 13, fontWeight: 500, color: "#0B5D5F", border: "1px solid #d6e5e5" },
  navButton:  { background: "none", border: "1.5px solid #d1dde0", borderRadius: 8, width: 34, height: 34, fontSize: 18, cursor: "pointer", color: "#0B5D5F", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 },
  successIcon:{ width: 56, height: 56, borderRadius: "50%", background: "#0B5D5F", color: "#fff", fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  timezoneBanner: { fontSize: 13, color: "#3d5a5e", background: "#f0f7f7", border: "1px solid #d6e5e5", borderRadius: 8, padding: "10px 14px", marginBottom: 24 },
};
```

---

## 3. Form Fields

### Step 1: Calendar & Time Selection

| Element         | Details                                                   |
|-----------------|-----------------------------------------------------------|
| Calendar        | Weekdays only (Mon-Fri), no past dates                    |
| Time Slots      | UAE business hours: 9:00 AM - 4:30 PM, 30-min intervals  |
| Timezone        | Generated in UAE time (Asia/Dubai, +04:00), displayed in user's local timezone |
| Grid layout     | Calendar: 7 columns; Time slots: 3 columns (desktop)     |

### Step 2: User Information Form

| Field                 | Input Type | Required | Validation                          | Default     |
|-----------------------|------------|----------|-------------------------------------|-------------|
| First Name            | text       | Yes      | Non-empty after trim                | -           |
| Last Name             | text       | Yes      | Non-empty after trim                | -           |
| Email                 | email      | Yes      | Contains `@`, max 254 chars         | -           |
| Country of Residence  | select     | Yes      | Must select from 67-country list    | -           |
| Phone Country Code    | select     | Yes      | Linked to dial code                 | AE (+971)   |
| Mobile Number         | tel        | Yes      | 4-15 digits, numeric only           | -           |
| Service Interest      | select     | Yes      | Must select from list               | -           |
| Current Size of Fund  | select     | Yes      | Must select from list               | -           |
| Additional Info       | textarea   | No       | Max 1000 chars                      | -           |

### Service Options
1. Retirement Planning
2. Investment Advice
3. Wills & Estate Planning
4. Tax Advice
5. UK Pension Transfer
6. Regular Saving
7. Property Investments
8. Insurance
9. US Retirement Plans

### Fund Size Options
1. Less than £100,000
2. £100,000 to £250,000
3. £250,000 to £500,000
4. More than £500,000

### Validation Error Display
- Per-field error messages appear below each input
- Error text: 11px, color `#e05252`
- Invalid input border: `#e05252`
- Errors clear on field update
- ARIA live region announces errors for screen readers

---

## 4. Ortto API Integration

### Architecture

```
Browser (React)  ->  POST /api/book  ->  Vercel Serverless  ->  Ortto API
                    (frontend payload)    (api/book.js)        (activities/create)
```

### Environment Variable
```
ORTTO_API_KEY=<your-ortto-api-key>
```

### Ortto API Endpoint
- **URL**: `https://api.eu.ap3api.com/v1/activities/create`
- **Method**: POST
- **Auth Header**: `X-Api-Key: <ORTTO_API_KEY>`
- **Content-Type**: `application/json`

### Frontend Payload (sent to /api/book)

```javascript
{
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  country: "United Kingdom",
  country_code: "GB",              // ISO country code
  phone_country_code: "AE",        // Phone prefix country
  dial_code: "+971",               // Full dial code
  phone: "+971501234567",          // Full phone string
  phone_raw: "501234567",          // Digits only
  service_interest: "Retirement Planning",
  fund_size: "£250,000 to £500,000",
  extra_questions: "Any additional text...",

  // Datetime (all generated from selected slot)
  uae_date: "2026-03-15",
  uae_time: "13:30",
  uae_datetime: "2026-03-15T13:30:00+04:00",
  local_date: "2026-03-15",
  local_time: "09:30",
  local_datetime: "2026-03-15T09:30:00",
  local_timezone: "Europe/London",
  utc_datetime: "2026-03-15T09:30:00.000Z",

  // UTM tracking (captured from URL params)
  utm: {
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "spring_launch",
    utm_term: "",
    utm_content: ""
  }
}
```

### Ortto Activity Payload (sent to Ortto API)

```javascript
{
  activities: [
    {
      activity_id: "act:cm:meeting-form-submitted",
      attributes: {
        "phn:cm:phone-number": {
          c: "971",                          // Country code (digits only, no +)
          n: "501234567"                     // Phone number (raw digits)
        },
        "str:cm:country-of-residence": "GB", // ISO country code
        "str:cm:email": "john@example.com",
        "str:cm:first-name": "John",
        "str:cm:last-name": "Doe",
        "str:cm:service-interest": "Retirement Planning",
        "str:cm:fund-size": "£250,000 to £500,000",
        "str:cm:extra-questions": "Any additional text...",
        "str:cm:uae-datetime": "2026-03-15T13:30:00+04:00",
        "str:cm:local-datetime": "2026-03-15T09:30:00",
        "str:cm:local-timezone": "Europe/London",
        "str:cm:utm-source": "google",
        "str:cm:utm-medium": "cpc",
        "str:cm:utm-campaign": "spring_launch",
        "str:cm:utm-term": "",
        "str:cm:utm-content": ""
      },
      fields: {
        "str::email": "john@example.com"    // Used for contact merge
      }
    }
  ],
  merge_by: ["str::email"]                   // Merge/upsert on email
}
```

### Ortto Attribute Naming Convention

| Prefix   | Type    | Example                        |
|----------|---------|--------------------------------|
| `str:cm:` | String  | `str:cm:first-name`           |
| `phn:cm:` | Phone   | `phn:cm:phone-number`         |
| `str::`   | System  | `str::email` (built-in field) |

**Activity ID format**: `act:cm:<activity-name>` (e.g. `act:cm:meeting-form-submitted`)

### Backend Validation (api/book.js)

```javascript
// Required string fields (non-empty after trim)
const requiredStrings = [
  "first_name", "last_name", "email", "country",
  "service_interest", "fund_size"
];

// Email: must contain "@", max 254 characters
// Phone (phone_raw): 4-15 digits
// Datetime: uae_datetime, local_datetime, utc_datetime must exist
```

### HTTP Response Codes

| Code | Meaning                         |
|------|---------------------------------|
| 200  | `{ ok: true }` - success       |
| 400  | Invalid payload / validation    |
| 405  | Non-POST method                 |
| 500  | Missing API key / server error  |
| 502  | Ortto API returned an error     |

### Security Measures
- UTM params whitelisted (only expected keys extracted)
- All values coerced to strings before sending to Ortto
- API key stored as env var, never exposed to frontend
- Server-side validation mirrors client-side validation
- `extra_questions` capped at 1000 chars

---

## 5. Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | React 18                          |
| Build       | Vite                              |
| Hosting     | Vercel                            |
| Serverless  | Vercel Functions (`/api/book.js`) |
| CRM         | Ortto (EU region)                 |
| Styling     | Inline React styles (no CSS framework) |
| Fonts       | Self-hosted WOFF2                 |

---

## 6. Project Structure (for new tools)

```
new-tool/
├── api/
│   └── book.js              # Vercel serverless proxy -> Ortto
├── public/
│   ├── favicon.png
│   └── fonts/
│       ├── FTCalhern-Medium.woff2
│       ├── FTCalhern-Semibold.woff2
│       ├── Sentient-Regular.woff2
│       └── Sentient-Medium.woff2
├── src/
│   ├── components/           # UI components
│   ├── data/
│   │   ├── constants.js      # Service options, fund sizes, etc.
│   │   └── countries.js      # Country list with dial codes
│   ├── hooks/
│   │   └── useIsMobile.js    # Mobile breakpoint hook (640px)
│   ├── utils/                # Shared utilities
│   ├── styles.js             # Centralized style objects
│   ├── main.jsx              # React entry point
│   └── App.jsx               # Main app component
├── index.html                # HTML shell with font declarations
├── vite.config.js
├── package.json
└── .env.example              # ORTTO_API_KEY=
```

---

## 7. Adapting for a New Tool

When creating a new tool from this template:

1. **Copy the project structure** above
2. **Keep fonts, favicon, and styles.js** unchanged for brand consistency
3. **Update `constants.js`** with new service options or dropdown values
4. **Modify the form fields** in your main component to match the new tool's data needs
5. **Update the Ortto activity ID** in `api/book.js` (e.g. `act:cm:new-tool-submitted`)
6. **Add/remove Ortto attributes** in the payload to match your new fields - follow the `str:cm:field-name` naming convention
7. **Set `ORTTO_API_KEY`** in Vercel environment variables
8. **Keep the same validation patterns** for email, phone, and required fields
