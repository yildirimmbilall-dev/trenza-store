# TRƎNZA — Cloudflare Workers + Static Assets + D1

Bu sürüm, Cloudflare Workers Static Assets mimarisine geçirilmiştir.

## Yapı
- `public/` → sitenin statik dosyaları
- `worker/index.js` → API yönlendirmesi + static asset fallback
- `functions/api/` → mevcut pre-register, preorder ve health kodları
- `wrangler.jsonc` → Workers + Assets + D1 yapılandırması

## Cloudflare
Workers Builds ile GitHub repository bağlandığında varsayılan deploy komutu `npx wrangler deploy` kullanılabilir.

`wrangler.jsonc` D1 kaynağını `trenza-prelaunch` adıyla otomatik provision edilecek şekilde tanımlar. İlk deploy sırasında Cloudflare/Wrangler hesabı için gerekli D1 kaynağını oluşturabilir.

Deploy sonrası:
- `/api/health`
- `/api/pre-register`
- `/api/preorder`

endpoint'leri Worker üzerinden çalışır.

## Önemli
- `trenza.com.tr` DNS kayıtlarına bu paket dokunmaz.
- Custom domain, Worker deploy edildikten ve test edildikten sonra Cloudflare dashboard'dan bağlanmalıdır.
- Ödeme hâlâ kapalıdır.
