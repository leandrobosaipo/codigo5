import { runStaticSiteGeneration } from "./generate-static-site.mjs";

await runStaticSiteGeneration({
  includeInstitutional: false,
  includeBlogPosts: false,
  includeBlogTaxonomies: false,
  includeAutomation: true,
});
