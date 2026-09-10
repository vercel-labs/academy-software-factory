import { defineSandbox } from "eve/sandbox";
import { vercel } from "eve/sandbox/vercel";
import { repoBootstrap, repoOnSession, repoRevalidationKey } from "../../lib/github/repo-sandbox.js";
export default defineSandbox({
  backend: vercel(),
  bootstrap: repoBootstrap,
  onSession: repoOnSession,
  revalidationKey: repoRevalidationKey,
});
