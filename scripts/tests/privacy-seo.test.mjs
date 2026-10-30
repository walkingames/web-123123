import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

async function get(path) {
  const response = await fetch(new URL(path, baseUrl), { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200, `${path} must stay publicly accessible`);
  return response.text();
}

function robotsDirective(html) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0])
    .find((value) => /name="robots"/.test(value));
  return tag?.match(/content="([^"]*)"/)?.[1] ?? "";
}

test("privacy remains accessible but explicitly opts out of indexing", async () => {
  const html = await get("/privacy");
  const directives = robotsDirective(html).split(/,\s*/);
  assert.ok(directives.includes("noindex"), "Privacy must emit noindex");
  assert.ok(directives.includes("follow"), "Privacy must not block discovery of ordinary links");
  assert.match(html, /Emrehan Dalaman/, "Existing policy content must remain available");
});

test("sitemap excludes privacy while robots permits crawling its noindex directive", async () => {
  const sitemap = await get("/sitemap.xml");
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/privacy\/?<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/walkingames\.com<\/loc>/);
  const robots = await get("/robots.txt");
  assert.doesNotMatch(robots, /^Disallow:\s*\/privacy\/?\s*$/m);
  assert.match(robots, /^Allow:\s*\/\s*$/m);
});

test("home names both founders in server-rendered content and Organization data without hiding legal access", async () => {
  const html = await get("/");
  assert.ok(!robotsDirective(html).split(/,\s*/).includes("noindex"), "Home must remain indexable");
  assert.match(html, /href="\/privacy"/, "Footer must keep its legal link");
  assert.match(html, /co-founded and run by Yusuf Okuducu and Emrehan Dalaman/);
  const graphs = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1])["@graph"] ?? []);
  const organization = graphs.find((node) => node["@type"] === "Organization");
  assert.ok(organization, "Home must describe the studio organization");
  assert.deepEqual(organization.founder?.map((person) => person.name), ["Yusuf Okuducu", "Emrehan Dalaman"]);
  assert.ok(organization.founder.every((person) => person["@type"] === "Person"));
  assert.equal(organization.owner, undefined, "Founder metadata must not invent a legal ownership statement");
});
