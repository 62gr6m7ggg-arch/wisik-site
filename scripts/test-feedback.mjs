import { onRequestPost } from "../functions/api/feedback.js";

const originalFetch = globalThis.fetch;
let sentEmail = null;
globalThis.fetch = async (url, options = {}) => {
  if (String(url).includes("siteverify")) {
    return new Response(JSON.stringify({ success: true, action: "wisik_kladblok", hostname: "wisik.nl" }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
  if (String(url).includes("/email/sending/send")) {
    sentEmail = JSON.parse(options.body);
    return new Response(JSON.stringify({ success: true, result: { message_id: "test" } }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
  throw new Error(`Onverwacht netwerkverzoek: ${url}`);
};

const env = {
  TURNSTILE_SECRET_KEY: "secret",
  CF_ACCOUNT_ID: "account",
  EMAIL_API_TOKEN: "token",
  FEEDBACK_TO: "owner@example.com",
  FEEDBACK_FROM: "kladblok@wisik.nl"
};
const base = {
  category: "ervaring",
  attraction: "pabo-rekenklaar",
  message: "Dit is een inhoudelijk bruikbare testnotitie.",
  email: "student@example.com",
  quotePermission: false,
  company: "",
  page: "/",
  siteVersion: "0.1.0",
  turnstileToken: "dummy"
};

const validRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json", "CF-Connecting-IP": "192.0.2.1" },
  body: JSON.stringify(base)
});
const validResponse = await onRequestPost({ request: validRequest, env });
if (validResponse.status !== 200) throw new Error(`Geldige inzending geweigerd: ${validResponse.status}`);
if (!sentEmail || sentEmail.to !== env.FEEDBACK_TO || sentEmail.replyTo !== base.email) throw new Error("E-mailpayload klopt niet");

const shortRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ ...base, message: "te kort" })
});
const shortResponse = await onRequestPost({ request: shortRequest, env });
if (shortResponse.status !== 400) throw new Error("Te korte notitie is niet geweigerd");

const botRequest = new Request("https://wisik.nl/api/feedback", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ ...base, company: "spam" })
});
const botResponse = await onRequestPost({ request: botRequest, env });
if (botResponse.status !== 200) throw new Error("Honeypot reageert niet neutraal");

globalThis.fetch = originalFetch;
console.log("Feedbackfunctie geslaagd: validatie, Turnstile-gate, e-mailpayload en honeypot.");
