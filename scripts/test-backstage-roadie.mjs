import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backstage = fs.readFileSync(path.join(root, "public/backstage/index.html"), "utf8");
const roadieSection = backstage.match(/<section\b[^>]*\bid=["']roadie["'][^>]*>[\s\S]*?<\/section>/)?.[0];
const roadiePhotoPath = path.join(root, "public/assets/img/roadie-edwin-d3745f13.jpeg");

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

assert(roadieSection, "De Roadie-sectie ontbreekt");
const youtubeLinks = [...roadieSection.matchAll(/<a\b[^>]*href=["']https:\/\/youtu\.be\/JygCTgAxcsk["'][^>]*>/g)].map((match) => match[0]);
assert(youtubeLinks.length === 1, "De Roadie-sectie moet precies één link naar het HAN-portret bevatten");
assert(/class=["'][^"']*roadie-video-card[^"']*["']/.test(youtubeLinks[0]), "De enige HAN-portretlink is niet de grote Roadie-kaart");
assert(/aria-describedby=["']han-video-note["']/.test(youtubeLinks[0]), "De Roadie-kaart verwijst niet naar de privacytoelichting");
for (const link of youtubeLinks) {
  assert(/target=["']_blank["']/.test(link), "Een HAN-portretlink opent niet in een nieuw tabblad");
  assert(/rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/.test(link), "Een HAN-portretlink mist noopener/noreferrer");
  assert(/aria-label=["'][^"']+["']/.test(link), "Een HAN-portretlink mist een toegankelijke naam");
}

assert(backstage.includes('class="roadie-video-card"'), "De festivalachtige videokaart ontbreekt");
assert(!backstage.includes('class="roadie-actions"'), "De losse, dubbele videoknop is niet verwijderd");
assert(!/<a\b[^>]*class=["'][^"']*btn[^"']*coral[^"']*["'][^>]*href=["']https:\/\/youtu\.be\/JygCTgAxcsk["']/i.test(roadieSection), "De losse koraalkleurige videoknop staat nog in de Roadie-sectie");
assert(backstage.includes('url("/assets/img/roadie-edwin-d3745f13.jpeg")'), "De aangeleverde Roadie-foto is niet als kaartachtergrond ingesteld");
assert(backstage.includes('background-position: center, 50% 10%'), "De desktopuitsnede van de Roadie-foto is niet vastgelegd");
assert(backstage.includes('background-position: center, 50% 6%'), "De mobiele uitsnede van de Roadie-foto is niet vastgelegd");
assert(fs.existsSync(roadiePhotoPath), "Het lokale bronbestand voor de Roadie-achtergrond ontbreekt");
const roadiePhoto = fs.readFileSync(roadiePhotoPath);
assert(roadiePhoto.length > 100_000, "De Roadie-achtergrond lijkt geen volledige foto te bevatten");
assert(roadiePhoto[0] === 0xff && roadiePhoto[1] === 0xd8 && roadiePhoto[2] === 0xff, "De Roadie-achtergrond is geen geldig JPEG-bestand");
assert(createHash("sha256").update(roadiePhoto).digest("hex") === "d3745f137b8e810e62f4aaf5117e58ebe8002ce41237739e9de383827376930f", "De Roadie-achtergrond is niet de door de gebruiker aangeleverde foto");
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

console.log("Backstage-roadiecontrole geslaagd: één videokaart, aangeleverde fotoachtergrond, mobiele uitsnede, toegankelijkheid en privacyvriendelijke videolink.");
