const ALLOWED_CATEGORIES = new Set([
  "ervaring",
  "inhoudelijke-fout",
  "technische-fout",
  "verbetersuggestie",
  "nieuwe-tool",
  "anders"
]);
const ALLOWED_ATTRACTIONS = new Set([
  "algemeen",
  "pabo-rekenklaar",
  "vo",
  "hbo",
  "rafelrand",
  "backstage"
]);

const json = (body, status = 200) => Response.json(body, {
  status,
  headers: {
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  }
});

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
})[char]);

function cleanLine(value, maxLength) {
  return String(value ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength);
}

function cleanMessage(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, 2000);
}

function validEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value) && value.length <= 180;
}

async function verifyTurnstile({ token, secret, remoteIp }) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);
  form.append("idempotency_key", crypto.randomUUID());

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form
  });
  if (!response.ok) throw new Error("Turnstile-verificatie was tijdelijk niet bereikbaar");
  return response.json();
}

export async function onRequestPost({ request, env }) {
  if (!env.TURNSTILE_SECRET_KEY || !env.CF_ACCOUNT_ID || !env.EMAIL_API_TOKEN || !env.FEEDBACK_TO || !env.FEEDBACK_FROM) {
    return json({ message: "Het Wisik-Kladblok is nog niet volledig geconfigureerd." }, 503);
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).hostname !== new URL(request.url).hostname) {
        return json({ message: "Dit formulier mag alleen vanaf Wisik worden verzonden." }, 403);
      }
    } catch {
      return json({ message: "Ongeldige herkomst van het formulier." }, 403);
    }
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return json({ message: "Ongeldig formulierformaat." }, 415);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ message: "Het formulier kon niet worden gelezen." }, 400);
  }

  // Honeypot: reageer neutraal, zodat eenvoudige spambots geen nuttige feedback krijgen.
  if (cleanLine(payload.company, 100)) {
    return json({ ok: true });
  }

  const category = cleanLine(payload.category, 60);
  const attraction = cleanLine(payload.attraction, 80);
  const message = cleanMessage(payload.message);
  const email = cleanLine(payload.email, 180);
  const page = cleanLine(payload.page, 180);
  const siteVersion = cleanLine(payload.siteVersion, 30);
  const token = cleanLine(payload.turnstileToken, 2048);
  const quotePermission = payload.quotePermission === true;

  if (!ALLOWED_CATEGORIES.has(category) || !ALLOWED_ATTRACTIONS.has(attraction)) {
    return json({ message: "De gekozen categorie of attractie is niet geldig." }, 400);
  }
  if (message.length < 10 || message.length > 2000) {
    return json({ message: "Schrijf een notitie van 10 tot en met 2.000 tekens." }, 400);
  }
  if (!validEmail(email)) {
    return json({ message: "Controleer het ingevulde e-mailadres." }, 400);
  }
  if (!token) {
    return json({ message: "De spamcontrole ontbreekt." }, 400);
  }

  let turnstile;
  try {
    turnstile = await verifyTurnstile({
      token,
      secret: env.TURNSTILE_SECRET_KEY,
      remoteIp: request.headers.get("CF-Connecting-IP") || ""
    });
  } catch {
    return json({ message: "De spamcontrole kon niet worden uitgevoerd. Probeer het later opnieuw." }, 503);
  }

  if (!turnstile.success || (turnstile.action && turnstile.action !== "wisik_kladblok")) {
    return json({ message: "De spamcontrole is niet geslaagd. Vernieuw de pagina en probeer opnieuw." }, 400);
  }

  const categoryLabels = {
    "ervaring": "Ervaring",
    "inhoudelijke-fout": "Inhoudelijke fout",
    "technische-fout": "Technische fout",
    "verbetersuggestie": "Verbetersuggestie",
    "nieuwe-tool": "Idee voor nieuwe tool",
    "anders": "Anders"
  };
  const attractionLabels = {
    "algemeen": "Wisik algemeen",
    "pabo-rekenklaar": "Pabo Rekenklaar",
    "vo": "VO-veld",
    "hbo": "HBO-werkplaats",
    "rafelrand": "Rafelrand",
    "backstage": "Backstage"
  };

  const subject = `[Wisik-Kladblok] ${categoryLabels[category]} — ${attractionLabels[attraction]}`;
  const text = [
    "Nieuwe notitie op het Wisik-Kladblok",
    "",
    `Categorie: ${categoryLabels[category]}`,
    `Attractie/terrein: ${attractionLabels[attraction]}`,
    `Pagina: ${page || "niet meegegeven"}`,
    `Siteversie: ${siteVersion || "onbekend"}`,
    `E-mailadres voor reactie: ${email || "niet ingevuld"}`,
    `Toestemming voor geanonimiseerd citaat: ${quotePermission ? "ja" : "nee"}`,
    "",
    "Notitie:",
    message
  ].join("\n");

  const html = `<h2>Nieuwe notitie op het Wisik-Kladblok</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><th align="left">Categorie</th><td>${escapeHtml(categoryLabels[category])}</td></tr>
      <tr><th align="left">Attractie/terrein</th><td>${escapeHtml(attractionLabels[attraction])}</td></tr>
      <tr><th align="left">Pagina</th><td>${escapeHtml(page || "niet meegegeven")}</td></tr>
      <tr><th align="left">Siteversie</th><td>${escapeHtml(siteVersion || "onbekend")}</td></tr>
      <tr><th align="left">E-mailadres</th><td>${escapeHtml(email || "niet ingevuld")}</td></tr>
      <tr><th align="left">Geanonimiseerd citeren</th><td>${quotePermission ? "ja" : "nee"}</td></tr>
    </table>
    <h3>Notitie</h3><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  const emailBody = {
    to: env.FEEDBACK_TO,
    from: env.FEEDBACK_FROM,
    subject,
    text,
    html
  };
  if (email) emailBody.replyTo = email;

  let emailResponse;
  try {
    emailResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CF_ACCOUNT_ID)}/email/sending/send`, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${env.EMAIL_API_TOKEN}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(emailBody)
    });
  } catch {
    return json({ message: "De e-maildienst was tijdelijk niet bereikbaar." }, 503);
  }

  const emailResult = await emailResponse.json().catch(() => ({}));
  if (!emailResponse.ok || emailResult.success === false) {
    console.error("Wisik feedback e-mail mislukt", {
      status: emailResponse.status,
      errors: emailResult.errors || []
    });
    return json({ message: "De notitie kon niet worden afgeleverd. Probeer het later opnieuw." }, 502);
  }

  return json({ ok: true });
}

export function onRequest() {
  return json({ message: "Gebruik POST voor het Wisik-Kladblok." }, 405);
}
