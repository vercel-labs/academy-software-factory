import { expect, it } from "vitest";
import { normalizeIssue } from "./intake.js";
const raw = { title: "Fix channel lookup", html_url: "https://github.com/example/sdk/issues/42", number: 999 };
it("uses the normalized event number and selects only source fields", () => {
  expect(normalizeIssue({ issueNumber: 42, raw: { ...raw, body: "SLACK fails" } })).toEqual({
    number: 42, title: raw.title, body: "SLACK fails", url: raw.html_url,
  });
});
it.each([null, undefined, ""])("normalizes empty body %s", body => {
  expect(normalizeIssue({ issueNumber: 42, raw: body === undefined ? raw : { ...raw, body } }).body).toBe("");
});
it("rejects invalid source fields before creating work", () => {
  expect(() => normalizeIssue({ issueNumber: 42, raw: { ...raw, html_url: "bad" } })).toThrow();
  expect(() => normalizeIssue({ issueNumber: 0, raw })).toThrow();
});
