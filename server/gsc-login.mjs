import { chromium } from 'playwright';

const property = process.env.COD5_GSC_PROPERTY;
const profileDir = process.env.COD5_GSC_PROFILE_DIR;
if (!property?.startsWith('sc-domain:') || !profileDir) throw new Error('GSC property and profile directory required');

const context = await chromium.launchPersistentContext(profileDir, { headless: false });
const page = context.pages()[0] || await context.newPage();
await page.goto(`https://search.google.com/search-console?resource_id=${encodeURIComponent(property)}`);
console.log('Navegador de login dedicado aberto. Termine o login e pressione Ctrl+C para salvar e fechar.');
await new Promise(resolve => process.once('SIGINT', resolve));
await context.close();
