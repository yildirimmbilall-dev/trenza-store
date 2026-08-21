# TRƎNZA — Cloudflare Workers + Static Assets + D1 + Resend

Bu sürüm Cloudflare Workers Static Assets + D1 kullanır.

## Yapı
- `public/` → sitenin statik dosyaları
- `worker/index.js` → API yönlendirmesi + static asset fallback
- `functions/api/` → pre-register, preorder, health ve Resend bildirimleri
- `wrangler.jsonc` → Workers + Assets + D1 yapılandırması

## API
- `GET /api/health`
- `POST /api/pre-register`
- `POST /api/preorder`

Ön kayıt ve ön sipariş gönderimleri aynı Worker üzerinden alınır. D1'e kaydedilir ve Resend üzerinden `hello@trenza.com.tr` adresine bildirim gönderilir.

## Resend
Resend'de `trenza.com.tr` gönderim için doğrulanmış olmalıdır.

GitHub repository secrets içine `RESEND_API_KEY` eklenmelidir. Deploy workflow'u bu secret varsa Worker secret'ı olarak `RESEND_API_KEY` adıyla yükler.

API key'i kod içine, `wrangler.jsonc` içine veya public dosyalara yazmayın.

## VITA asset
Repo, doğru VITA ürün görselinin deployment sırasında `public/assets/products/vita.jpg` olarak yeniden oluşturulması için `.trenza-assets/vita.jpg.b64` kaynağını içerir. Böylece eski yanlış VITA görseli deploy'a geri dönmez.

## Cloudflare
Workers Builds ile GitHub repository bağlandığında `npx wrangler deploy` çalışır. `trenza.com.tr` custom domain Worker'a bağlandığında aynı-origin `/api/*` endpoint'leri kullanılabilir.

Ödeme hâlâ kapalıdır; bu sürüm ön kayıt / ön sipariş talebi toplar.
