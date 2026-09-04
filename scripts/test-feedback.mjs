import { onRequestPost } from "../functions/api/feedback.js";
import { onRequestGet } from "../functions/api/config.js";

const originalFetch = globalThis.fetch;
let turnstileResult = { success: true, action: "wisik_kladblok", hostname: "wisik.nl" };
let networkCalls = 0;

globalThis.fetch = async (url) => {
  networkCalls += 1;
  if (!String(url).includes("siteverify")) {
    throw new Error(`Onverwacht serververzoek: ${url}`);
  }
  return new Response(JSON.stringify(turnstileResult), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};

const env = {
  TURNSTILE_SITE_KEY: "site-key",
  TURNSTILE_SECRET_KEY: "secret-key"
};
const base = {
  category: "ervaring",
  attraction: "pabo-rekenklaar",
  message: "Dit is een inhoudelijk bruikbare testnotitie.",
  email: "student@example.com",
  quotePermission: false,
  company: "",
  page: "/kladblok/",
  siteVersion: "0.1.2",
  turnstileToken: "dummy"
};

function request(payload, origin = "https://wisik.nl") {
  return new Request("https://wisik.nl/api/feedback", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "origin": origin,
      "CF-Connecting-IP": "192.0.2.1"
    },
    body: JSON.stringify(payload)
  });
}

const configResponse = await onRequestGet({ env });
const config = await configResponse.json();
if (!config.feedbackEnabled || config.turnstileSiteKey !== env.TURNSTILE_SITE_KEY) {
  throw new Error("Kladblokconfiguratie wordt niet correct vrijgegeven");
}
if (config.provider !== "formsubmit" || config.providerRetentionDays !== 30) {
  throw new Error("Providerinformatie ontbreekt in de configuratie");
}

networkCalls = 0;
const validResponse = await onRequestPost({ request: request(base), env });
if (validResponse.status !== 200) throw new Error(`Geldige inzending geweigerd: ${validResponse.status}`);
const validResult = await validResponse.json();
if (networkCalls !== 1) throw new Error("De server mag alleen Turnstile benaderen");
if (
  !validResult.ok ||
  validResult.delivery?.method !== "POST" ||
  validResult.delivery?.action !== "https://formsubmit.co/kladblok@wisik.nl"
) {
  throw new Error("De gevalideerde browser-bezorgroute klopt niet");
}
const fields = validResult.delivery.fields;
if (
  fields.Bericht !== base.message ||
  fields.email !== base.email ||
  fields._captcha !== "false" ||
  fields._next !== "https://wisik.nl/kladblok/?verzonden=1" ||
  !fields._subject.includes("Pabo Rekenklaar") ||
  fields.Siteversie !== "0.1.2"
) {
  throw new Error("De opgeschoonde bezorgvelden kloppen niet");
}

const shortResponse = await onRequestPost({ request: request({ ...base, message: "te kort" }), env });
if (shortResponse.status !== 400) throw new Error("Te korte notitie is niet geweigerd");

networkCalls = 0;
const botResponse = await onRequestPost({ request: request({ ...base, company: "spam" }), env });
const botResult = await botResponse.json();
if (botResponse.status !== 200 || botResult.ignored !== true || networkCalls !== 0) {
  throw new Error("Honeypot reageert niet neutraal of benadert toch een dienst");
}

const foreignResponse = await onRequestPost({ request: request(base, "https://example.org"), env });
if (foreignResponse.status !== 403) throw new Error("Vreemde herkomst is niet geweigerd");

const badEmailResponse = await onRequestPost({ request: request({ ...base, email: "geen-e-mailadres" }), env });
if (badEmailResponse.status !== 400) throw new Error("Ongeldig e-mailadres is niet geweigerd");

turnstileResult = { success: true, action: "wisik_kladblok", hostname: "example.org" };
const wrongHostResponse = await onRequestPost({ request: request(base), env });
if (wrongHostResponse.status !== 400) throw new Error("Turnstile-token van verkeerd hostname is niet geweigerd");

turnstileResult = { success: true, action: "andere_actie", hostname: "wisik.nl" };
const wrongActionResponse = await onRequestPost({ request: request(base), env });
if (wrongActionResponse.status !== 400) throw new Error("Turnstile-token met verkeerde actie is niet geweigerd");

turnstileResult = { success: true, action: "wisik_kladblok", hostname: "wisik.nl" };
globalThis.fetch = originalFetch;
console.log("Feedbackfunctie geslaagd: configuratie, Turnstile, validatie, honeypot en veilige browser-bezorgroute.");
