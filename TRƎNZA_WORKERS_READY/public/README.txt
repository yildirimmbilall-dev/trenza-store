TRƎNZA — ÖNERİ 1 (Final Lansman Sitesi)
Tarih: 20 Ağustos 2026

Bu paket “bilinen eksiklerin tamamlandığı” güncel sürümdür.

TAMAMLANANLAR
1. Ürün açıklamaları TR + EN (dil değişince dönüyor)
2. Mini / Kids notu ölçü bölümüne eklendi
3. Boş script temizlendi
4. Sepet + dil geçişi çakışması giderildi
5. Mağaza görseli yok; dürüst lansman dili
6. Kategori filtreleri + ön kayıt sepeti
7. Yazısız (sadece özel T) ürün fotoğrafları

BİLİNEN SINIRLAR
- Ürün foto oranları ideal 4:5 değil (CSS contain ile kesilmiyor)
- Gerçek ödeme / üyelik yok (şirket + altyapı sonrası)
- Hosting sizin tarafınızda

KULLANIM
Klasörü hosting köküne yükleyin. Ana dosya: index.html

---
CLAUDE TARAFINDAN YAPILAN DÜZELTMELER (2026-08-20)
---
Bu build üzerinde, ağ/backend erişimi gerektirmeyen tüm maddeler düzeltildi:

1. commerce-config.js artık index.html'e bağlı (önceden hiç yüklenmiyordu).
2. Ön kayıt ve ön sipariş formları artık önce window.TRENZA_COMMERCE.checkoutEndpoint
   adresine POST atmayı dener; endpoint boşsa (şu an öyle) mailto: yedeğine düşer.
   Gerçek bir form/e-posta servisi (Formspree, Web3Forms, Cloudflare Worker vb.)
   kurulduğunda tek yapman gereken commerce-config.js içindeki checkoutEndpoint
   değerini doldurmak — kodun geri kalanı değişmeyecek.
3. Her iki forma da honeypot (bot tuzağı) alanı + client-side e-posta doğrulama eklendi.
4. Sepet çekmecesi ve ön sipariş modalı artık ESC ile kapanıyor, odak (focus) modal
   içine hapsediliyor ve kapanınca odağı tetikleyen butona geri döndürüyor.
5. Tüm görseller (hero, koleksiyon, ürünler, ölçü rehberi, atölye) için WebP
   versiyonları üretildi ve <picture> ile JPG yedekli şekilde bağlandı (~%35 daha
   küçük dosya boyutu, daha hızlı yükleme — özellikle mobilde).
6. Marka renkleriyle uyumlu gerçek favicon/apple-touch-icon/PWA ikonları (16/32/180/
   192/512 px + favicon.ico) üretildi ve manifest/head güncellendi.
7. Kullanılmayan boutique.jpg (hero.jpg ile birebir aynı dosya) silindi.
8. Ölçü rehberi görselinin altına, ekran okuyucu ve SEO dostu bir HTML ölçü
   tablosu eklendi (gerçek ölçüler netleşene kadar "—" ile işaretli, README'deki
   dürüst yaklaşımla tutarlı).

DEĞİŞTİRİLMEDEN BIRAKILANLAR (gerçek backend/hesap/şirket bilgisi gerektirir):
- Gerçek e-posta/sipariş veritabanı, server-side doğrulama, gerçek stok/sipariş no
- KVKK/Gizlilik/Çerez/Mesafeli Satış metinleri (şirket kurulmadan yazılamaz)
- Gerçek fiyat, ölçü, materyal verisi
- WAVE/BAIA fotoğraf kalitesi, ürün oranlarının standardizasyonu, ek ürün fotoğrafları
  (yeniden çekim gerektirir)
- Google Fonts'un lokale indirilmesi (ağ erişimi gerektirir)
