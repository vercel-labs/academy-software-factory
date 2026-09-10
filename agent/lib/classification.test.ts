import { expect, it } from "vitest";
import { classificationSchema } from "./classification.js";
const clear = { actionable: true, type: "bug", risk: "medium", confidence: 0.9, rationale: "Specific behavior", questions: [] };
it("requires useful questions for unclear or unknown work", () => {
  expect(classificationSchema.safeParse({ ...clear, actionable: false }).success).toBe(false);
  expect(classificationSchema.safeParse({ ...clear, type: "unknown" }).success).toBe(false);
  expect(classificationSchema.safeParse({ ...clear, actionable: false, questions: ["Which input fails?"] }).success).toBe(true);
});
it("rejects unresolved questions on actionable work and invalid confidence", () => {
  expect(classificationSchema.safeParse({ ...clear, questions: ["Which input?"] }).success).toBe(false);
  expect(classificationSchema.safeParse({ ...clear, confidence: 1.1 }).success).toBe(false);
  expect(classificationSchema.safeParse({ ...clear, confidence: -0.1 }).success).toBe(false);
});
