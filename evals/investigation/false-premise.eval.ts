import { defineEval } from "eve/evals";
export default defineEval({
  description: "An existing whitespace check disproves a bug without creating a candidate.",
  tags: ["slow", "investigation"],
  async test(t) {
    await t.send("Issue #44, https://github.com/example/sdk/issues/44. Empty messages are delivered: sending a whitespace-only notification succeeds and creates a delivery receipt. Reject empty messages and add a regression test.");
    t.succeeded();
    t.calledSubagent("investigator");
    t.calledTool("record_evidence", { output: { status: "stopped" } });
    t.notCalledTool("builder");
    t.notCalledTool("verifier");
    t.notCalledTool("github__createPullRequest");
  },
});
