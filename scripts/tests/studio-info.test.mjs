import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

test("founder explanation is server-rendered in a closed, labelled info tooltip", async () => {
  const response = await fetch(baseUrl, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const buttons = [...html.matchAll(/<button\b[^>]*>/g)].map((match) => match[0]);
  const trigger = buttons.find((tag) => tag.includes('aria-label="About the studio"'));
  assert.ok(trigger, "Studio explanation needs an accessible info button");
  assert.match(trigger, /aria-expanded="false"/);
  const id = trigger.match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(id, "Info button must describe its associated tooltip");
  const tags = [...html.matchAll(/<div\b[^>]*>/g)].map((match) => match[0]);
  const tooltip = tags.find((tag) => tag.includes(`id="${id}"`));
  assert.ok(tooltip, "Associated tooltip must be rendered with the page");
  assert.match(tooltip, /role="tooltip"/);
  assert.match(tooltip, /\shidden(?:=""|\s|>)/);
  assert.match(html, /co-founded and run by Yusuf Okuducu and Emrehan Dalaman/);
});
