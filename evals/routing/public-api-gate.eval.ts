import { defineEval } from "eve/evals";
export default defineEval({
  description: "An exported API proposal is investigated, then parked before implementation.",
  tags: ["slow", "routing"],
  async test(t) {
    await t.send("Issue #92, https://github.com/example/sdk/issues/92. Add an optional priority field to exported Notification with normal, high and urgent values. Existing callers must keep working unchanged.");
    t.parked();
    t.calledTool("classify_issue");
    t.calledTool("route_work_order");
    t.calledSubagent("investigator");
    t.calledTool("approve_spec", { status: "pending" });
    t.requireInputRequest({ toolName: "approve_spec" });
    t.calledSubagent("builder", { count: 0 });
    t.calledSubagent("verifier", { count: 0 });
    t.calledTool("github__createPullRequest", { count: 0 });
  },
});
