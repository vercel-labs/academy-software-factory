import { execFile, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { SandboxCommandResult, SandboxNetworkPolicy } from "eve/sandbox";
import { expect, it } from "vitest";
import { refreshDefaultBranch } from "./repo-sandbox.js";
import { runBranchOperation } from "./branch-operation.js";
import { REMOTE_URL, REPO_DIR } from "./git-remote.js";

it("pushes and checks out a real Git candidate without changing main", async () => {
  const directory = mkdtempSync(join(tmpdir(), "academy-branch-"));
  const source = join(directory, "source");
  const remote = join(directory, "remote.git");
  const builder = join(directory, "builder");
  const verifier = join(directory, "verifier");
  function git(cwd: string, ...args: string[]) {
    return execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  }
  const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;
  const policies: SandboxNetworkPolicy[] = [];
  function dependencies(checkout: string) {
    return {
      getToken: async () => "unused-local-test-token",
      getSandbox: async () => ({
        setNetworkPolicy: async (policy: SandboxNetworkPolicy) => { policies.push(policy); },
        run: ({ command }: { command: string }) => new Promise<SandboxCommandResult>(resolve => {
          const localCommand = command.replaceAll(REPO_DIR, quote(checkout)).replaceAll(REMOTE_URL, quote(remote));
          execFile("/bin/sh", ["-c", localCommand], (error, stdout, stderr) => {
            resolve({ stdout, stderr, exitCode: error ? (typeof error.code === "number" ? error.code : 1) : 0 });
          });
        }),
      }),
    };
  }
  try {
    mkdirSync(source);
    git(source, "init", "-b", "main");
    git(source, "config", "user.name", "Course test");
    git(source, "config", "user.email", "course@example.test");
    writeFileSync(join(source, "sample.txt"), "baseline\n");
    git(source, "add", "sample.txt");
    git(source, "commit", "-m", "baseline");
    git(directory, "clone", "--bare", source, remote);
    git(directory, "clone", remote, builder);
    git(directory, "clone", remote, verifier);
    const templateBase = git(remote, "rev-parse", "main");
    writeFileSync(join(source, "upstream.txt"), "An unrelated change after template creation\n");
    git(source, "add", "upstream.txt");
    git(source, "commit", "-m", "advance base after template");
    git(source, "push", remote, "main");
    const base = git(remote, "rev-parse", "main");
    expect(base).not.toBe(templateBase);
    expect(git(verifier, "rev-parse", "origin/main")).toBe(templateBase);
    await refreshDefaultBranch(await dependencies(builder).getSandbox());
    await refreshDefaultBranch(await dependencies(verifier).getSandbox());
    expect(git(builder, "rev-parse", "main")).toBe(base);
    expect(git(verifier, "rev-parse", "origin/main")).toBe(base);
    git(builder, "config", "user.name", "Course test");
    git(builder, "config", "user.email", "course@example.test");
    git(builder, "switch", "-c", "factory/fix");
    writeFileSync(join(builder, "sample.txt"), "candidate\n");
    git(builder, "add", "sample.txt");
    git(builder, "commit", "-m", "candidate");
    const head = git(builder, "rev-parse", "HEAD");
    expect(await runBranchOperation({ branch: "factory/fix", operation: "push" }, dependencies(builder))).toMatchObject({ success: true });
    expect(git(remote, "rev-parse", "main")).toBe(base);
    expect(git(remote, "rev-parse", "factory/fix")).toBe(head);
    expect(await runBranchOperation({ branch: "factory/fix", operation: "checkout" }, dependencies(verifier))).toMatchObject({ success: true });
    expect(git(verifier, "rev-parse", "HEAD")).toBe(head);
    expect(git(verifier, "diff", "--name-only", "origin/main...HEAD")).toBe("sample.txt");
    expect(await runBranchOperation({ branch: "factory/missing", operation: "checkout" }, dependencies(verifier))).toMatchObject({ success: false });
    expect(git(verifier, "rev-parse", "HEAD")).toBe(head);
    expect(policies.at(-1)).toBe("allow-all");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
