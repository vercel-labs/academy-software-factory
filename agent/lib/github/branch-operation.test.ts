import { describe, expect, it, vi } from "vitest";
import { runBranchOperation } from "./branch-operation.js";
import { validateBranch } from "./git-remote.js";

function harness() {
  const sandbox = {
    run: vi.fn().mockResolvedValue({ exitCode: 0, stdout: "done", stderr: "" }),
    setNetworkPolicy: vi.fn().mockResolvedValue(undefined),
  };
  return { sandbox, getSandbox: vi.fn(async () => sandbox), getToken: vi.fn(async () => "test-token") };
}
describe("branch capability", () => {
  it.each(["main", "master", "HEAD", "refs/heads/factory/a", "other/a", "factory/", "factory/a..b", "factory/a//b", "factory/.hidden", "factory/a.lock", "factory/a'", "factory/a;id"])("rejects %s before any resource access", async branch => {
    const h = harness();
    expect(await runBranchOperation({ branch, operation: "push" }, h)).toMatchObject({ success: false });
    expect(h.getSandbox).not.toHaveBeenCalled();
    expect(h.getToken).not.toHaveBeenCalled();
  });
  it("accepts a scoped branch", () => expect(validateBranch("factory/bug-normalize-channel")).toBeNull());
  it("pushes an explicit ref without a token in the shell command", async () => {
    const h = harness();
    expect(await runBranchOperation({ branch: "factory/fix", operation: "push" }, h)).toEqual({ success: true, branch: "factory/fix" });
    const command = h.sandbox.run.mock.calls[0]?.[0].command;
    expect(command).toContain("refs/heads/factory/fix:refs/heads/factory/fix");
    expect(command).not.toContain("test-token");
    expect(command).not.toContain("--force");
    expect(h.sandbox.setNetworkPolicy).toHaveBeenLastCalledWith("allow-all");
  });
  it("reports Git failure and removes credential brokering", async () => {
    const h = harness();
    h.sandbox.run.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "non-fast-forward" });
    expect(await runBranchOperation({ branch: "factory/fix", operation: "push" }, h)).toMatchObject({ success: false, error: "non-fast-forward" });
    expect(h.sandbox.setNetworkPolicy).toHaveBeenLastCalledWith("allow-all");
  });
  it("removes credential brokering when execution throws", async () => {
    const h = harness();
    h.sandbox.run.mockRejectedValue(new Error("sandbox lost"));
    await expect(runBranchOperation({ branch: "factory/fix", operation: "checkout" }, h)).rejects.toThrow("sandbox lost");
    expect(h.sandbox.setNetworkPolicy).toHaveBeenLastCalledWith("allow-all");
  });
  it("does not check out a stale local branch when fetch fails", async () => {
    const h = harness();
    h.sandbox.run.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "remote branch missing" });
    expect(await runBranchOperation({ branch: "factory/missing", operation: "checkout" }, h)).toMatchObject({ success: false });
    expect(h.sandbox.run.mock.calls[0]?.[0].command).toContain("'refs/heads/factory/missing' && git");
  });
});
