import { describe, expect, it } from "vitest";
import type { Classification } from "./classification.js";
import { routeClassification } from "./routing.js";
const clear: Classification = { actionable: true, type: "bug", risk: "medium", confidence: 1, rationale: "Specific behavior", questions: [] };
describe("authority boundaries", () => {
  it("stops unclear work before repository access", () => {
    expect(routeClassification({ ...clear, actionable: false, questions: ["Which docs?"] })).toMatchObject({ lane: "manual", approvalRequired: true });
  });
  it("allows a bounded documentation lane without a universal gate", () => {
    expect(routeClassification({ ...clear, type: "documentation", risk: "low" })).toMatchObject({ lane: "documentation", approvalRequired: false });
  });
  it("investigates plausible bugs, including claims later disproved", () => {
    expect(routeClassification(clear)).toMatchObject({ lane: "bug", approvalRequired: false });
  });
  it("requires approval for public contracts regardless of confidence or claimed risk", () => {
    expect(routeClassification({ ...clear, type: "public-api", risk: "low" })).toMatchObject({ lane: "public-api", approvalRequired: true });
  });
  it.each(["bug", "documentation"] as const)("gates high-risk %s work", type => {
    expect(routeClassification({ ...clear, type, risk: "high" }).approvalRequired).toBe(true);
  });
});
