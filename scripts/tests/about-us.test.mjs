import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

// Exercise the rendered page, not source-code strings. Run against dev or start.
test("Team introduces both co-founders in the requested order", async () => {
  const response = await fetch(baseUrl, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const section = html.match(/<section\b[^>]*\bid="about-us"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, "Home page must render the team section");
  assert.match(section, /Team \/ The people behind the games/);
  assert.doesNotMatch(section, /founder__number/, "Founder portraits must not display numbered labels");
  assert.match(section, /href="https:\/\/www\.yusufokuducu\.com\/"/);
  assert.match(section, /href="https:\/\/www\.linkedin\.com\/in\/yusufokuducu\/"/);
  assert.match(section, /href="https:\/\/www\.linkedin\.com\/in\/emrehan-dalaman-1252581b6"/);
  assert.equal((section.match(/class="founder__social-link"/g) ?? []).length, 3);
  assert.match(section, /Yusuf Okuducu/);
  assert.match(section, /Emrehan Dalaman/);
  assert.ok(section.indexOf("Yusuf Okuducu") < section.indexOf("Emrehan Dalaman"));
  assert.equal((section.match(/Co-founder/g) ?? []).length, 2);
  assert.equal((section.match(/Game Developer/g) ?? []).length, 2);
  assert.match(html, /href="#about-us"[^>]*>Team<\/a>/);
});
