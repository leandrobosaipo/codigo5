import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const repoRoot = "/Users/leandrobosaipo/.openclaw/codigo5-github";

const casesDir = path.join(repoRoot, "public/assets/codigo5/cases");
const generatedDir = path.join(repoRoot, "public/assets/codigo5/generated");

const dataUri = (relativePath) => {
  const absolutePath = path.join(repoRoot, relativePath);
  const buffer = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).slice(1).toLowerCase();
  const mime =
    ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "webp"
          ? "image/webp"
          : "application/octet-stream";
  return `data:${mime};base64,${buffer.toString("base64")}`;
};

const covers = [
  {
    output: path.join(generatedDir, "services-case-collage.png"),
    accent: "#67E8F9",
    accent2: "#A3E635",
    background: "radial-gradient(circle at 18% 18%, rgba(103,232,249,0.18), transparent 32%), radial-gradient(circle at 82% 20%, rgba(163,230,53,0.18), transparent 26%), linear-gradient(160deg, #091321 0%, #0d1b2f 55%, #08101b 100%)",
    images: [
      { src: dataUri("public/assets/codigo5/cases/clinicapetterle-home.png"), className: "hero" },
      { src: dataUri("public/assets/codigo5/cases/sonatamusical-home.png"), className: "support top" },
      { src: dataUri("public/assets/codigo5/cases/alphavillebuffet-home.png"), className: "support bottom" },
    ],
  },
  {
    output: path.join(generatedDir, "portfolio-case-collage.png"),
    accent: "#C084FC",
    accent2: "#67E8F9",
    background: "radial-gradient(circle at 82% 16%, rgba(192,132,252,0.18), transparent 28%), radial-gradient(circle at 20% 78%, rgba(103,232,249,0.14), transparent 24%), linear-gradient(155deg, #081120 0%, #10192c 52%, #0a1020 100%)",
    images: [
      { src: dataUri("public/assets/codigo5/cases/alphavillebuffet-home.png"), className: "hero" },
      { src: dataUri("public/assets/codigo5/cases/roonoticias-home.png"), className: "support top" },
      { src: dataUri("public/assets/codigo5/cases/clinicapetterle-home.png"), className: "support bottom" },
    ],
  },
  {
    output: path.join(generatedDir, "blog-editorial-collage.png"),
    accent: "#A3E635",
    accent2: "#38BDF8",
    background: "radial-gradient(circle at 18% 24%, rgba(163,230,53,0.16), transparent 28%), radial-gradient(circle at 86% 22%, rgba(56,189,248,0.18), transparent 26%), linear-gradient(155deg, #0a1220 0%, #121d31 48%, #0a1020 100%)",
    images: [
      { src: dataUri("public/assets/codigo5/cases/roonoticias-home.png"), className: "hero" },
      { src: dataUri("public/assets/codigo5/cases/portalpantanalmt-home.png"), className: "support top" },
      { src: dataUri("public/assets/codigo5/cases/sonatamusical-home.png"), className: "support bottom" },
    ],
  },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });

for (const cover of covers) {
  const imagesHtml = cover.images
    .map(
      (image) => `
        <div class="frame ${image.className}">
          <img src="${image.src}" alt="" />
        </div>
      `,
    )
    .join("");

  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { margin: 0; width: 1600px; height: 900px; overflow: hidden; background: #08101b; }
          body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: ${cover.background};
          }
          .canvas {
            position: relative;
            width: 1600px;
            height: 900px;
            padding: 54px;
          }
          .shell {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 40px;
            border: 1px solid rgba(255,255,255,0.08);
            background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
            box-shadow: 0 30px 90px rgba(0,0,0,0.28);
            overflow: hidden;
          }
          .glow {
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 0% 0%, rgba(255,255,255,0.08), transparent 28%),
              radial-gradient(circle at 100% 0%, ${cover.accent}22, transparent 24%),
              radial-gradient(circle at 80% 100%, ${cover.accent2}22, transparent 28%);
            pointer-events: none;
          }
          .grid {
            position: absolute;
            inset: 28px;
            display: grid;
            grid-template-columns: 1.26fr 0.74fr;
            gap: 22px;
          }
          .frame {
            position: relative;
            overflow: hidden;
            border-radius: 30px;
            border: 1px solid rgba(255,255,255,0.10);
            background: #0a1423;
            box-shadow: 0 24px 70px rgba(0,0,0,0.34);
          }
          .frame::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.16));
            pointer-events: none;
          }
          .frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
            display: block;
          }
          .hero {
            height: 100%;
            min-height: 0;
          }
          .rail {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 22px;
          }
          .support {
            min-height: 0;
          }
          .chrome {
            position: absolute;
            left: 30px;
            right: 30px;
            top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
            pointer-events: none;
          }
          .dots { display: flex; gap: 9px; }
          .dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: rgba(255,255,255,0.28);
          }
          .badge {
            width: 126px;
            height: 12px;
            border-radius: 999px;
            background: linear-gradient(90deg, ${cover.accent}, ${cover.accent2});
            opacity: 0.94;
          }
          .panel-lines {
            position: absolute;
            right: 44px;
            bottom: 42px;
            width: 330px;
            display: grid;
            gap: 12px;
            z-index: 10;
          }
          .line {
            height: 12px;
            border-radius: 999px;
            background: rgba(255,255,255,0.16);
          }
          .line.short { width: 58%; background: rgba(255,255,255,0.22); }
          .line.medium { width: 74%; }
        </style>
      </head>
      <body>
        <div class="canvas">
          <div class="shell">
            <div class="glow"></div>
            <div class="chrome">
              <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
              <div class="badge"></div>
            </div>
            <div class="grid">
              <div class="frame hero">
                <img src="${cover.images[0].src}" alt="" />
              </div>
              <div class="rail">
                <div class="frame support">
                  <img src="${cover.images[1].src}" alt="" />
                </div>
                <div class="frame support">
                  <img src="${cover.images[2].src}" alt="" />
                </div>
              </div>
            </div>
            <div class="panel-lines">
              <div class="line short"></div>
              <div class="line"></div>
              <div class="line medium"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: cover.output });
  console.log(`generated:${cover.output}`);
}

await browser.close();
