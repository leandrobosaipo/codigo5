import { runStaticSiteGeneration } from "./generate-static-site.mjs";

await runStaticSiteGeneration({
  includeInstitutional: false,
  includeBlogPosts: true,
  includeBlogTaxonomies: false,
  includeAutomation: false,
});
