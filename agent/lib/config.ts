import { z } from "zod";

const repositorySchema = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/, "FACTORY_REPO must be a GitHub owner/repo without shell syntax");
export const FACTORY_REPO = repositorySchema.parse(process.env.FACTORY_REPO ?? "your-github-name/signalworks-software-factory");
const [owner, repo] = z.tuple([z.string().min(1), z.string().min(1)]).parse(FACTORY_REPO.split("/"));
export const factoryRepo = { owner, repo };
export const FACTORY_LABEL = z.string().min(1).parse(process.env.FACTORY_LABEL ?? "factory");
export const FACTORY_BRANCH_PREFIX = z.string()
  .regex(/^[A-Za-z0-9][A-Za-z0-9_-]*\/$/, "FACTORY_BRANCH_PREFIX must be a simple namespace ending in /, such as factory/")
  .parse(process.env.FACTORY_BRANCH_PREFIX ?? "factory/");
