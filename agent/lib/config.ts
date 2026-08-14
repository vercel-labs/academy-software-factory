export const FACTORY_REPO =
  process.env.FACTORY_REPO ?? "your-github-name/signalworks-software-factory";

const repoParts = FACTORY_REPO.split("/");
if (repoParts.length !== 2 || repoParts.some((part) => part.length === 0)) {
  throw new Error(
    `FACTORY_REPO must use the owner/repo format, received "${FACTORY_REPO}".`
  );
}

export const factoryRepo = {
  owner: repoParts[0] as string,
  repo: repoParts[1] as string,
};

export const FACTORY_LABEL = process.env.FACTORY_LABEL ?? "factory";
export const FACTORY_BRANCH_PREFIX =
  process.env.FACTORY_BRANCH_PREFIX ?? "factory/";

