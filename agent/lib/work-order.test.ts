import { describe, expect, it } from "vitest";
import { addEvidence, createWorkOrder, workOrderSchema } from "./work-order.js";

const source = { number: 42, title: "Normalize channels", body: "SLACK fails", url: "https://github.com/example/sdk/issues/42" };
describe("work orders", () => {
  it("starts with source provenance and no invented evidence", () => {
    const order = createWorkOrder(source);
    expect(order).toEqual({ id: "issue-42", source, status: "received", evidence: [] });
    expect(workOrderSchema.safeParse({ ...order, status: "looks-good-to-me" }).success).toBe(false);
  });
  it("appends timestamped evidence without mutating prior history", () => {
    const order = createWorkOrder(source);
    const updated = addEvidence(order, { kind: "observation", summary: "Whitespace already rejected" });
    expect(updated.evidence).toHaveLength(1);
    expect(updated.evidence[0]?.recordedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(order.evidence).toEqual([]);
    expect(workOrderSchema.parse(JSON.parse(JSON.stringify(updated)))).toEqual(updated);
  });
});
