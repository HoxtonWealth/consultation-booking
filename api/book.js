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

    // Extract UTM params
    const utm = body.utm || {};

    // Build Ortto activity payload
    const orttoPayload = {
      activities: [
        {
          activity_id: "act:cm:meeting-form-submitted",
          attributes: {
            "phn:cm:phone-number": {
              c: (body.dial_code || "").replace(/\D/g, ""),
              n: body.phone_raw || "",
            },
            "str:cm:country-of-residence": body.country || "",
            "str:cm:email": body.email || "",
            "str:cm:first-name": body.first_name || "",
            "str:cm:last-name": body.last_name || "",
            "str:cm:service-interest": body.service_interest || "",
            "str:cm:fund-size": body.fund_size || "",
            "str:cm:extra-questions": body.extra_questions || "",
            "str:cm:uae-datetime": body.uae_datetime || "",
            "str:cm:local-datetime": body.local_datetime || "",
            "str:cm:local-timezone": body.local_timezone || "",
            "str:cm:utm-source": utm.utm_source || "",
            "str:cm:utm-medium": utm.utm_medium || "",
            "str:cm:utm-campaign": utm.utm_campaign || "",
            "str:cm:utm-term": utm.utm_term || "",
            "str:cm:utm-content": utm.utm_content || "",
          },
          fields: {
            "str::email": body.email || "",
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

    const orttoData = await orttoRes.text();

    if (!orttoRes.ok) {
      console.error("Ortto API error:", orttoRes.status, orttoData);
      return res
        .status(orttoRes.status)
        .json({ error: "Failed to submit booking", detail: orttoData });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Booking handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
