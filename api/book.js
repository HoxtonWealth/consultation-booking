export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ORTTO_API_KEY;
  if (!apiKey) {
    console.error("ORTTO_API_KEY is not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const body = req.body;

    const validationError = validateBookingPayload(body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Whitelist UTM params — only pick expected keys
    const rawUtm = body.utm || {};
    const utm = {
      utm_source: String(rawUtm.utm_source || ""),
      utm_medium: String(rawUtm.utm_medium || ""),
      utm_campaign: String(rawUtm.utm_campaign || ""),
      utm_term: String(rawUtm.utm_term || ""),
      utm_content: String(rawUtm.utm_content || ""),
    };

    // Build Ortto activity payload — coerce all values to strings
    const orttoPayload = {
      activities: [
        {
          activity_id: "act:cm:meeting-form-submitted",
          attributes: {
            "phn:cm:phone-number": {
              c: String(body.dial_code || "").replace(/\D/g, ""),
              n: String(body.phone_raw || ""),
            },
            "str:cm:country-of-residence": String(body.country_code || ""),
            "str:cm:email": String(body.email || ""),
            "str:cm:first-name": String(body.first_name || ""),
            "str:cm:last-name": String(body.last_name || ""),
            "str:cm:service-interest": String(body.service_interest || ""),
            "str:cm:fund-size": String(body.fund_size || ""),
            "str:cm:extra-questions": String(body.extra_questions || "").slice(0, 1000),
            "str:cm:uae-datetime": String(body.uae_datetime || ""),
            "str:cm:local-datetime": String(body.local_datetime || ""),
            "str:cm:local-timezone": String(body.local_timezone || ""),
            "str:cm:utm-source": utm.utm_source,
            "str:cm:utm-medium": utm.utm_medium,
            "str:cm:utm-campaign": utm.utm_campaign,
            "str:cm:utm-term": utm.utm_term,
            "str:cm:utm-content": utm.utm_content,
          },
          fields: {
            "str::email": String(body.email || ""),
          },
        },
      ],
      merge_by: ["str::email"],
    };

    const orttoRes = await fetch(
      "https://api.eu.ap3api.com/v1/activities/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify(orttoPayload),
      }
    );

    if (!orttoRes.ok) {
      const orttoData = await orttoRes.text();
      console.error("Ortto API error:", orttoRes.status, orttoData);
      return res.status(502).json({ error: "Failed to submit booking" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Booking handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function validateBookingPayload(body) {
  if (!body || typeof body !== "object") {
    return "Invalid request body";
  }

  const requiredStrings = [
    "first_name", "last_name", "email", "country",
    "service_interest", "fund_size",
  ];
  for (const field of requiredStrings) {
    if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
      return `Missing required field: ${field}`;
    }
  }

  const email = body.email.trim();
  if (!email.includes("@") || email.length > 254) {
    return "Invalid email address";
  }

  const phoneRaw = body.phone_raw;
  if (!phoneRaw || typeof phoneRaw !== "string" || phoneRaw.trim().length < 4 || phoneRaw.trim().length > 15) {
    return "Invalid phone number";
  }

  if (!body.uae_datetime || !body.local_datetime || !body.utc_datetime) {
    return "Missing booking datetime";
  }

  return null;
}
