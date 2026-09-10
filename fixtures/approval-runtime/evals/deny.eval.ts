import { defineEval } from "eve/evals";
export default defineEval({
  description: "A denied specification never executes the approval tool.",
  async test(t) {
    const paused = await t.send("Request specification approval.");
    paused.parked();
    t.requireInputRequest({ toolName: "approve_spec" });
    await t.respondAll("cancel");
    t.succeeded();
    t.calledTool("approve_spec", { status: "rejected", count: 1 });
    t.calledTool("approve_spec", { status: "completed", count: 0 });
  },
});
