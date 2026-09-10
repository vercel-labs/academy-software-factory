import { defineEval } from "eve/evals";
import { equals } from "eve/evals/expect";
export default defineEval({
  description: "The real specification tool executes only after approval and resumes the same session.",
  async test(t) {
    const paused = await t.send("Request specification approval.");
    paused.parked();
    paused.calledTool("approve_spec", { status: "pending", count: 1 });
    paused.calledTool("approve_spec", { status: "completed", count: 0 });
    t.requireInputRequest({ toolName: "approve_spec", input: { workOrderId: "issue-92" } });
    const resumed = await t.respondAll("approve");
    t.check(resumed.sessionId, equals(paused.sessionId));
    t.succeeded();
    t.calledTool("approve_spec", {
      status: "completed", count: 1,
      output: { approved: true, workOrderId: "issue-92", specification: { acceptanceCriteria: ["Existing callers remain valid"] } },
    });
  },
});
