import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backstage = fs.readFileSync(path.join(root, "public/backstage/index.html"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const requiredText = [
  "Backstage · ontmoet de roadie",
  "Wiskunde hoeft niet stil te zitten.",
  "Mijn missie is wiskunde leuk maken.",
  "wiskunde leuk maken voor leerlingen en studenten",
  "Initiatiefnemer en roadie achter Wisik",
  "docent wiskunde in opleiding aan de HAN",
  "Bekijk het verhaal achter Wisik",
  "De persoonlijke motivatie is het vertrekpunt.",
  "Missie vraagt om vakmanschap"
];
for (const text of requiredText) {
  assert(backstage.includes(text), `Backstage mist de afgesproken tekst: ${text}`);
}

const youtubeLinks = [...backstage.matchAll(/<a\b[^>]*href=["']https:\/\/youtu\.be\/JygCTgAxcsk["'][^>]*>/g)].map((match) => match[0]);
assert(youtubeLinks.length >= 2, "Het HAN-portret is niet zowel via de knop als de affiche bereikbaar");
for (const link of youtubeLinks) {
  assert(/target=["']_blank["']/.test(link), "Een HAN-portretlink opent niet in een nieuw tabblad");
  assert(/rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/.test(link), "Een HAN-portretlink mist noopener/noreferrer");
  assert(/aria-label=["'][^"']+["']/.test(link), "Een HAN-portretlink mist een toegankelijke naam");
}

assert(backstage.includes('class="roadie-video-card"'), "De festivalachtige videokaart ontbreekt");
assert(backstage.includes('class="roadie-play"'), "De herkenbare afspeelknop ontbreekt");
assert(backstage.includes('class="roadie-video-badge">HAN-portret</span>'), "Het HAN-portretlabel ontbreekt");
assert(backstage.includes("Wisik laadt hier geen externe videospeler"), "De privacyvriendelijke videokeuze wordt niet uitgelegd");
assert(!/<iframe\b/i.test(backstage), "Backstage laadt onnodig automatisch een externe videospeler");
assert(!/autoplay/i.test(backstage), "Het HAN-portret bevat ongewenste autoplay");
assert(!/youtube(?:-nocookie)?\.com\/embed/i.test(backstage), "Backstage bevat toch een automatisch geladen YouTube-embed");
assert(!/i\.ytimg\.com/i.test(backstage), "Backstage laadt automatisch een externe YouTube-thumbnail");

assert(backstage.includes('@media (max-width: 880px)'), "De roadiekaart mist tablet-/mobielontwerp");
assert(backstage.includes('@media (max-width: 560px)'), "De roadiekaart mist smalschermontwerp");
assert(backstage.includes('@media (prefers-reduced-motion: reduce)'), "De roadiekaart respecteert bewegingsvoorkeuren niet");
assert(backstage.includes('id="roadie"') && backstage.includes('id="kwaliteit"'), "De Backstage-sprongnavigatie is onvolledig");
assert(backstage.includes("geen institutionele goedkeuring van Wisik"), "De onafhankelijke status van het HAN-portret is niet verduidelijkt");

console.log("Backstage-roadiecontrole geslaagd: missie, festivalvormgeving, HAN-portret, toegankelijkheid en privacyvriendelijke videolink.");
