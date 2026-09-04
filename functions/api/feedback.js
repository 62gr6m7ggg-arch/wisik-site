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
const ALLOWED_TURNSTILE_HOSTNAMES = new Set([
  "wisik.nl",
  "www.wisik.nl"
]);
const DEFAULT_FORM_RECIPIENT = "kladblok@wisik.nl";

const json = (body, status = 200) => Response.json(body, {
  status,
  headers: {
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  }
});

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
  if (!env.TURNSTILE_SECRET_KEY) {
    return json({ message: "Het Wisik-Kladblok is nog niet volledig geconfigureerd." }, 503);
  }

  const formRecipient = cleanLine(env.FORM_RECIPIENT || env.FEEDBACK_FROM || DEFAULT_FORM_RECIPIENT, 180).toLowerCase();
  if (!validEmail(formRecipient)) {
    return json({ message: "Het ontvangstadres van het Wisik-Kladblok is niet geldig geconfigureerd." }, 503);
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

  if (
    !turnstile.success ||
    (turnstile.action && turnstile.action !== "wisik_kladblok") ||
    (turnstile.hostname && !ALLOWED_TURNSTILE_HOSTNAMES.has(turnstile.hostname))
  ) {
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
  const providerPayload = {
    _subject: subject,
    _template: "table",
    _captcha: "false",
    _honey: "",
    email,
    Categorie: categoryLabels[category],
    "Attractie of terrein": attractionLabels[attraction],
    Pagina: page || "niet meegegeven",
    Siteversie: siteVersion || "onbekend",
    "Toestemming geanonimiseerd citaat": quotePermission ? "ja" : "nee",
    Bericht: message
  };

  let providerResponse;
  try {
    providerResponse = await fetch(`https://formsubmit.co/ajax/${formRecipient}`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify(providerPayload)
    });
  } catch {
    return json({ message: "De bezorgdienst was tijdelijk niet bereikbaar." }, 503);
  }

  const providerResult = await providerResponse.json().catch(() => ({}));
  const providerFailed = providerResult.success === false || providerResult.success === "false";
  if (!providerResponse.ok || providerFailed) {
    console.error("Wisik feedbackbezorging mislukt", {
      status: providerResponse.status,
      providerMessage: cleanLine(providerResult.message, 200)
    });
    return json({ message: "De notitie kon niet worden afgeleverd. Probeer het later opnieuw." }, 502);
  }

  const activationPending = /activat|confirm/i.test(cleanLine(providerResult.message, 300));
  return json({ ok: true, activationPending });
}

export function onRequest() {
  return json({ message: "Gebruik POST voor het Wisik-Kladblok." }, 405);
}
