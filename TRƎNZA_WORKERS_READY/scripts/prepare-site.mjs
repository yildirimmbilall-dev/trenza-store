// TRƎNZA deployment preparation
// Applies the final site-level text/form fixes to the Worker build without exposing secrets.
import fs from 'node:fs/promises';

const indexPath = 'public/index.html';
const edgePath = 'public/assets/trenza-edge-overrides.js';

let html = await fs.readFile(indexPath, 'utf8');

// Restore the requested premium cord wording in the source HTML as well as the runtime layer.
html = html.replaceAll('DOĞAL MALZEME', 'PREMİUM KORDON');
html = html.replaceAll('Doğal ve sürdürülebilir iplikler kullanılır.', 'Yüksek kaliteli, şekil tutan premium kordon iplikler kullanılır.');
html = html.replaceAll('NATURAL MATERIALS', 'PREMIUM CORD');
html = html.replaceAll('Natural and more sustainable yarns are used.', 'Made with high-quality, shape-retaining premium cord yarns.');

// The early-access form must use the early-access endpoint, not the preorder endpoint.
html = html.replace(
  "const payload={type:'early-access',email,createdAt:new Date().toISOString()},endpoint=endpointFor()",
  "const payload={type:'early-access',email,createdAt:new Date().toISOString()},endpoint=(window.TRENZA_COMMERCE||{}).preRegisterEndpoint||'/api/pre-register'"
);

// Do not fall back to mailto: the site should not open the visitor's mail client.
html = html.replace(
  "status.textContent='Hazır. E-posta uygulaman açılıyor; gönder tuşuna bastığında bize ulaşacak.';window.location.href='mailto:hello@trenza.com.tr?subject='+subject+'&body='+body",
  "status.textContent='Talep gönderilemedi. Lütfen tekrar deneyin.';showToast('Talep gönderilemedi. Lütfen tekrar deneyin.');"
);
html = html.replace(
  "showToast('Talep hazırlandı — e-posta uygulaman açılıyor; gönder tuşuna bastığında bize ulaşacak.');window.location.href='mailto:hello@trenza.com.tr?subject='+subject+'&body='+body",
  "showToast('Talep gönderilemedi. Lütfen tekrar deneyin.');"
);
html = html.replace(
  'Ön kayıt listesine katılmak için e-posta uygulaman açılacak. Satış başladığında öncelikli haber vereceğiz.',
  "Kaydın doğrudan TRƎNZA'ya iletilir. Satış başladığında öncelikli haber vereceğiz."
);

// Make VITA use the stable asset produced by the deployment step.
html = html.replaceAll('assets/products/vita.webp', 'assets/products/vita-20260821.jpg');
html = html.replaceAll('assets/products/vita.jpg', 'assets/products/vita-20260821.jpg');

await fs.writeFile(indexPath, html, 'utf8');

// Quick View is injected at deploy time; point its VITA mapping at the stable filename too.
let edge = await fs.readFile(edgePath, 'utf8');
edge = edge.replace("VITA:'vita'", "VITA:'vita-20260821'");
await fs.writeFile(edgePath, edge, 'utf8');

console.log('TRƎNZA final deployment fixes applied.');
