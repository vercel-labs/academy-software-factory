import { defineSandbox, type SandboxSessionContext } from "eve/sandbox";
import { vercel } from "eve/sandbox/vercel";

export default defineSandbox({
  backend: vercel(),
  async onSession({ use }: SandboxSessionContext): Promise<void> {
    const sandbox = await use();
    const result = await sandbox.run({
      command: "git config --global --add safe.directory /workspace",
    });
    if (result.exitCode !== 0) {
      throw new Error("The root sandbox could not configure its checkout.");
    }
  },
});

