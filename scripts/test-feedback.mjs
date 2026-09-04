import { onRequestPost } from "../functions/api/feedback.js";
import { onRequestGet } from "../functions/api/config.js";

const originalFetch = globalThis.fetch;
let providerRequest = null;
let turnstileResult = { success: true, action: "wisik_kladblok", hostname: "wisik.nl" };
let providerStatus = 200;
let providerResult = { success: true, message: "The form was submitted successfully." };

globalThis.fetch = async (url, options = {}) => {
  if (String(url).includes("siteverify")) {
    return new Response(JSON.stringify(turnstileResult), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
  if (String(url).startsWith("https://formsubmit.co/ajax/")) {
    providerRequest = {
      url: String(url),
      payload: JSON.parse(String(options.body || "{}"))
    };
    return new Response(JSON.stringify(providerResult), {
      status: providerStatus,
      headers: { "content-type": "application/json" }
    });
  }
  throw new Error(`Onverwacht netwerkverzoek: ${url}`);
};

const env = {
  TURNSTILE_SITE_KEY: "site-key",
  TURNSTILE_SECRET_KEY: "secret-key",
  FEEDBACK_FROM: "kladblok@wisik.nl"
};
const base = {
  category: "ervaring",
  attraction: "pabo-rekenklaar",
  message: "Dit is een inhoudelijk bruikbare testnotitie.",
  email: "student@example.com",
  quotePermission: false,
  company: "",
  page: "/kladblok/",
  siteVersion: "0.1.1",
  turnstileToken: "dummy"
};

const configResponse = await onRequestGet({ env });
const config = await configResponse.json();
if (!config.feedbackEnabled || config.turnstileSiteKey !== env.TURNSTILE_SITE_KEY) {
  throw new Error("Kladblokconfiguratie wordt niet correct vrijgegeven");
}
if (config.provider !== "formsubmit" || config.providerRetentionDays !== 30) {
  throw new Error("Providerinformatie ontbreekt in de configuratie");
}

const validRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "origin": "https://wisik.nl",
    "CF-Connecting-IP": "192.0.2.1"
  },
  body: JSON.stringify(base)
});
const validResponse = await onRequestPost({ request: validRequest, env });
if (validResponse.status !== 200) throw new Error(`Geldige inzending geweigerd: ${validResponse.status}`);
if (providerRequest?.url !== "https://formsubmit.co/ajax/kladblok@wisik.nl") {
  throw new Error("FormSubmit-endpoint klopt niet");
}
if (
  providerRequest.payload.Bericht !== base.message ||
  providerRequest.payload.email !== base.email ||
  providerRequest.payload._captcha !== "false" ||
  !providerRequest.payload._subject.includes("Pabo Rekenklaar")
) {
  throw new Error("FormSubmit-payload klopt niet");
}

const shortRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ ...base, message: "te kort" })
});
const shortResponse = await onRequestPost({ request: shortRequest, env });
if (shortResponse.status !== 400) throw new Error("Te korte notitie is niet geweigerd");

providerRequest = null;
const botRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ ...base, company: "spam" })
});
const botResponse = await onRequestPost({ request: botRequest, env });
if (botResponse.status !== 200 || providerRequest !== null) {
  throw new Error("Honeypot reageert niet neutraal of verzendt toch gegevens");
}

const foreignRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json", "origin": "https://example.org" },
  body: JSON.stringify(base)
});
const foreignResponse = await onRequestPost({ request: foreignRequest, env });
if (foreignResponse.status !== 403) throw new Error("Vreemde herkomst is niet geweigerd");

turnstileResult = { success: true, action: "wisik_kladblok", hostname: "example.org" };
const wrongHostRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(base)
});
const wrongHostResponse = await onRequestPost({ request: wrongHostRequest, env });
if (wrongHostResponse.status !== 400) throw new Error("Turnstile-token van verkeerd hostname is niet geweigerd");
turnstileResult = { success: true, action: "wisik_kladblok", hostname: "wisik.nl" };

providerStatus = 502;
providerResult = { success: false, message: "provider down" };
const failedProviderRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(base)
});
const failedProviderResponse = await onRequestPost({ request: failedProviderRequest, env });
if (failedProviderResponse.status !== 502) throw new Error("Providerfout wordt niet correct afgehandeld");

globalThis.fetch = originalFetch;
console.log("Feedbackfunctie geslaagd: configuratie, Turnstile, FormSubmit-relay, validatie en honeypot.");
