import { it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { portfolioClients } from "@/content/siteContent";
import { markets, selectedWork } from "@/content/company";
it("keeps an existing brand image for every client and an image for every project", () => {
  for (const item of [...portfolioClients.map(c=>({name:c.name,image:c.logo})), ...selectedWork]) {
    expect(item.image, item.name).toBeTruthy();
    expect(fs.existsSync(path.join(process.cwd(), "public", item.image)), item.name).toBe(true);
  }
  expect(new Set(selectedWork.map(c=>c.name)).size).toBe(selectedWork.length);
  for (const market of markets) {
    for (const name of market.clients) {
      expect(portfolioClients.find(client => client.name === name)?.logo, `${market.title}: ${name}`).toBeTruthy();
    }
  }
});
