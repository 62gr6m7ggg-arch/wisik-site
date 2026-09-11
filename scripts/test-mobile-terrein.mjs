import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const homepage = read("public/index.html");
const runtime = read("public/assets/js/mobile-terrein.js");
const registry = read("public/assets/js/site-data.js");

// Small DOM fixture for reparenting and link behavior. This is not a layout/browser test.
class Node {
  constructor(tagName = "DIV", attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.children = [];
    this.listeners = {};
    this.dataset = { terrainTool: attributes["data-terrain-tool"] };
    this.parentNode = null;
  }
  get nextSibling() {
    return this.parentNode?.children[this.parentNode.children.indexOf(this) + 1] || null;
  }
  insertBefore(node, reference) {
    if (node === reference) return node;
    if (node.parentNode) node.parentNode.children.splice(node.parentNode.children.indexOf(node), 1);
    const index = reference ? this.children.indexOf(reference) : this.children.length;
    assert(index >= 0, "The reference must belong to the destination parent");
    this.children.splice(index, 0, node);
    node.parentNode = this;
    return node;
  }
  appendChild(node) { return this.insertBefore(node, null); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
  emit(name) { this.listeners[name]?.forEach(callback => callback()); }
  querySelector(selector) { return this.queries?.[selector] || null; }
}

function setup({ mobile = true, hash = "", withRegistry = true } = {}) {
  const attributes = text => Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
  const stripTags = text => text.replace(/<[^>]+>/g, "").replaceAll("&amp;", "&");
  const map = new Node();
  const festival = map.appendChild(new Node());
  const sideStages = map.appendChild(new Node());
  const anchors = [...homepage.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, content]) => {
    const link = new Node("A", attributes(attrs));
    const title = content.match(/<(?:h3|strong)\b[^>]*>([\s\S]*?)<\/(?:h3|strong)>/);
    const short = content.match(/<(?:p|small) class="terrain-short">([\s\S]*?)<\/(?:p|small)>/);
    link.queries = {
      "h3, strong": title ? { textContent: stripTags(title[1]) } : null,
      ".terrain-short": short ? { textContent: stripTags(short[1]) } : null,
    };
    return link;
  });
  const find = className => anchors.find(link => (link.getAttribute("class") || "").split(" ").includes(className));
  const stops = ["zone-vo", "zone-hbo", "zone-pabo", "zone-rafel", "zone-space", "kh-entry--map", "zone-backstage", "zone-kladblok"].map(find);
  assert(stops.every(Boolean), "A terrain destination is missing from the real homepage");
  stops.forEach(stop => festival.appendChild(stop));
  const board = festival.appendChild(new Node("FIGURE"));
  [find("moshpit"), find("grabbelton")].forEach(stop => sideStages.appendChild(stop));
  const originalFestival = [...festival.children];
  const originalSideStages = [...sideStages.children];
  map.queries = Object.fromEntries(stops.flatMap(stop => stop.getAttribute("class").split(" ").map(name => [`.${name}`, stop])));
  Object.assign(map.queries, {
    ".side-stage-card.moshpit": find("moshpit"),
    ".side-stage-card.grabbelton": find("grabbelton"),
    ".space-billboard-map": board,
  });
  const directory = new Node("DETAILS");
  directory.open = true;
  const walkList = new Node("UL");
  walkList.hidden = true;
  const media = new Node();
  media.matches = mobile;
  const window = new Node();
  window.location = { hash };
  window.matchMedia = () => media;
  const document = {
    querySelector: selector => ({ "#terrein": map, "[data-terrain-directory]": directory, "[data-terrain-walk-list]": walkList })[selector],
    querySelectorAll: selector => selector === "[data-terrain-tool]"
      ? anchors.filter(link => link.dataset.terrainTool)
      : anchors.filter(link => link.getAttribute("href") === "#vandaag-open"),
    createComment: () => new Node("#COMMENT"),
    createElement: tag => new Node(tag),
  };
  const context = vm.createContext({ window, document });
  if (withRegistry) vm.runInContext(registry, context);
  vm.runInContext(runtime, context);
  return {
    map, festival, sideStages, board, originalFestival, originalSideStages, directory, walkList, window, find, anchors,
    resize(mobile) { media.matches = mobile; media.emit("change"); },
  };
}

const page = setup();
const order = ["zone-pabo", "moshpit", "grabbelton", "zone-space", "kh-entry--map", "zone-vo", "zone-hbo", "zone-backstage", "zone-kladblok"];
assert.equal(page.directory.open, false, "The long alternative should start collapsed on mobile");
assert.deepEqual(page.map.children.filter(node => node.tagName === "A"), order.map(page.find), "Keyboard order must follow the walk");
assert.equal(page.walkList.hidden, false);
assert.equal(page.walkList.children.length, 9, "The list must include every walk destination");
const listLinks = page.walkList.children.map(item => item.children[0]);
order.forEach((name, index) => {
  assert.equal(listLinks[index].getAttribute("href"), page.find(name).getAttribute("href"));
  assert.equal(listLinks[index].children[0].textContent, page.find(name).querySelector("h3, strong").textContent);
});
assert.equal(page.find("zone-pabo").getAttribute("href"), "/apps/pabo-rekenklaar/");
assert.equal(page.find("zone-space").getAttribute("href"), "/apps/ruimteklaar/");
assert.equal(page.find("zone-kladblok").getAttribute("href"), "/kladblok/", "Keep the central feedback route");
page.anchors.find(link => link.getAttribute("href") === "#vandaag-open").emit("click");
assert.equal(page.directory.open, true, "The list link must reveal its destination before scrolling");

for (let round = 0; round < 3; round++) {
  page.resize(false);
  const withoutMarkers = parent => parent.children.filter(node => node.tagName !== "#COMMENT");
  assert.deepEqual(withoutMarkers(page.festival), page.originalFestival, "Restore the exact desktop slots");
  assert.deepEqual(withoutMarkers(page.sideStages), page.originalSideStages, "Restore desktop side-stage navigation");
  assert.equal(page.directory.open, true);
  assert.equal(page.find("zone-pabo").getAttribute("href"), "/pabo/pabo-rekenklaar/");
  page.resize(true);
  assert.deepEqual(page.map.children.filter(node => node.tagName === "A"), order.map(page.find));
  assert.equal(page.walkList.children.length, 9, "Rotating/resizing must not duplicate the list");
  assert.equal(listLinks[0].getAttribute("href"), "/apps/pabo-rekenklaar/");
}
page.window.location.hash = "#vandaag-open";
page.window.emit("hashchange");
assert.equal(page.directory.open, true, "A history/hash navigation must reveal the list too");
assert.equal(setup({ hash: "#vandaag-open" }).directory.open, true, "A direct list URL must remain usable");
assert.equal(setup({ mobile: false }).directory.open, true);
assert.equal(setup({ withRegistry: false }).find("zone-pabo").getAttribute("href"), "/pabo/pabo-rekenklaar/", "Missing registry must preserve the working HTML link");
assert.doesNotThrow(() => vm.runInNewContext(runtime, { document: { querySelector: () => null } }), "Other pages must be unaffected");
console.log("Mobiel terrein: canonieke ingangen, volledige lijst, focusvolgorde, directe lijst-URL en herhaald mobiel/desktop wisselen OK.");
