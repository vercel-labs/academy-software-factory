import { defineAgent } from "eve";
import { mockModel } from "eve/evals";
export default defineAgent({
  modelContextWindowTokens: 32_000,
  model: mockModel(({ toolResults }) => toolResults.length > 0
    ? "The approval decision has been recorded."
    : { toolCalls: [{
        name: "approve_spec",
        input: {
          workOrderId: "issue-92",
          approach: "Add an optional priority field without changing existing callers.",
          risks: ["Exported API compatibility"],
          acceptanceCriteria: ["Existing callers remain valid"],
        },
      }] }),
});
