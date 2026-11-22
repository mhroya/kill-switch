# Kill Switch — layihə qaydaları

## Layihə nədir
Multimedia texnologiyaları fənni üçün brauzerdə işləyən kiber "escape room" oyunu.
Oyunçunun noutbuku hacklənib; otaqdakı əşyalardakı ipuclarından istifadə edib
5 mərhələdə kodları qırır və sonda kill switch ilə hackeri bloklayır.

Mərhələlər:
1. Sezar şifrəsi (lövhə + monitordakı açar)
2. İkilik kod → mətn (monitor + ASCII posteri)
3. auth.log-da hücumçu IP-ni tapmaq (server)
4. Base64 deşifrə (USB)
5. Kill switch kodu (təqvimdəki qayda)

Xüsusiyyətlər: 3 çətinlik səviyyəsi, vaxt limiti, xal sistemi, hər oyunda təsadüfi kodlar,
terminal əmrləri (ls, cat, grep, base64 -d, unlock, hint, status), səs effektləri, rütbələr.

## Qaydalar
- Yalnız bu qovluqda işlə. Bu qovluqdan kənardakı fayllara (digər layihələrə) toxunma.
- Oyun tək fayldır: `index.html` (HTML + CSS + JS bir yerdə). Xarici kitabxana əlavə etmə.
- İnterfeys mətnləri Azərbaycan dilindədir.
- Hər mənalı dəyişiklikdən sonra qısa Azərbaycanca mesajla git commit et.
- Dəyişiklikdən sonra oyunun hər 5 mərhələdən keçə bildiyini yoxla.
