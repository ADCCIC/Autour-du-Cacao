/**
 * Newsletter subscription API route.
 * Supports Buttondown and Brevo (Sendinblue) as providers.
 *
 * Env vars required (server-side, set in Vercel):
 *   NEWSLETTER_API_KEY   — API key from your newsletter provider
 *   NEWSLETTER_PROVIDER  — "buttondown" (default) or "brevo"
 *
 * POST /api/subscribe
 * Body: { email: string }
 * Returns: { ok: true } or { error: string }
 */

export async function POST(request: Request) {
  let email: string;

  try {
    const body = await request.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Adresse e-mail invalide" }, { status: 422 });
  }

  const apiKey = process.env.NEWSLETTER_API_KEY;
  const provider = process.env.NEWSLETTER_PROVIDER ?? "buttondown";

  // No API key configured — accept silently in dev, return guidance in prod
  if (!apiKey) {
    console.warn("[subscribe] NEWSLETTER_API_KEY not set — subscription dropped");
    return Response.json({ ok: true, source: "stub" });
  }

  try {
    if (provider === "brevo") {
      return await subscribeBrevo(email, apiKey);
    }
    return await subscribeButtondown(email, apiKey);
  } catch (err) {
    console.error("[subscribe] Provider error:", err);
    return Response.json(
      { error: "Erreur lors de l'inscription. Réessayez plus tard." },
      { status: 502 }
    );
  }
}

async function subscribeButtondown(email: string, apiKey: string) {
  const res = await fetch("https://api.buttondown.email/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email, type: "regular" }),
  });

  if (res.status === 201 || res.status === 200) {
    return Response.json({ ok: true });
  }

  // Already subscribed
  if (res.status === 400) {
    const data = await res.json().catch(() => ({}));
    const msg = JSON.stringify(data);
    if (msg.includes("already")) {
      return Response.json({ ok: true, already: true });
    }
  }

  const errorText = await res.text().catch(() => "");
  console.error("[subscribe] Buttondown error", res.status, errorText);
  return Response.json(
    { error: "Erreur lors de l'inscription. Réessayez plus tard." },
    { status: 502 }
  );
}

async function subscribeBrevo(email: string, apiKey: string) {
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      listIds: [2], // default list — user can update this
      updateEnabled: true,
    }),
  });

  if (res.status === 201 || res.status === 204) {
    return Response.json({ ok: true });
  }

  const errorText = await res.text().catch(() => "");
  console.error("[subscribe] Brevo error", res.status, errorText);
  return Response.json(
    { error: "Erreur lors de l'inscription. Réessayez plus tard." },
    { status: 502 }
  );
}
