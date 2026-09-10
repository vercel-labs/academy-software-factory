import { expect, it } from "vitest";
import { createPullRequestPolicy } from "./approval.js";
it("permits an explicit draft", () => {
  expect(createPullRequestPolicy({ toolInput: { draft: true } })).toBe("not-applicable");
});
it.each([false, "true", 1, null, undefined])("rejects a non-literal draft flag %s", draft => {
  expect(createPullRequestPolicy({ toolInput: { draft } })).toMatchObject({ type: "denied" });
});
it("rejects absent input", () => {
  expect(createPullRequestPolicy({ toolInput: undefined })).toMatchObject({ type: "denied" });
});
