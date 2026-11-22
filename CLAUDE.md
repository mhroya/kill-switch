# Kill Switch: Phantom — layihə qaydaları

## Layihə nədir
Multimedia texnologiyaları fənni üçün brauzerdə işləyən tapmaca / escape room oyunu.
**Əsas sənəd `PLAN.md`-dir**: hekayə, tapmacalar, mexanikalar, texniki tələblər və iş mərhələləri oradadır.
Hər sessiyanın əvvəlində `PLAN.md`-ni oxu. Bu fayl ilə ziddiyyət olsa, `PLAN.md` üstündür.

Köhnə 5 mərhələli versiya `legacy/index.html`-dədir (git teqi `v1`). Ona toxunma və orada xəta düzəltmə.

## Qızıl qayda
Oyunçu kiberdən heç nə bilməyə bilər. Hər tapmaca oyundakı ipucları və alətlərlə həll olunmalıdır.

## Texniki qaydalar
- Yalnız HTML + CSS + sadə JavaScript. Xarici kitabxana, framework, build aləti yoxdur.
- **ES modules (`import`/`export`) işlətmə.** Oyun `index.html`-ə iki dəfə klikləyəndə (`file://`) açılmalı və internet tələb etməməlidir.
  Adi `<script src>` teqləri və bir global `Game` obyekti istifadə olunur: hər fayl `Game`-ə öz hissəsini əlavə edir.
- Qovluq strukturu `PLAN.md` bölmə 7-dəki kimidir. Yeni JS faylı əlavə edəndə onu `index.html`-də düzgün sırada qoş.
- Mətnlər mümkün qədər `js/story/texts.js`-də toplanır. İnterfeys və şərhlər Azərbaycan dilindədir (ə, ö, ü, ğ, ş, ç, ı).
- `localStorage` əməliyyatları həmişə `try/catch` içində olsun.
- Faktlarda əmin deyilsənsə, yazma (bax: `PLAN.md` bölmə 6).
- Real film, oyun, brend loqosu və ya personajı təqlid etmə.

## Köhnə versiyadakı məlum xətalar — yeni versiyada təkrarlanmamalıdır
- Terminala `undefined` mətn ötürülür → konsolda `reading 'slice'` xətası. Çıxış funksiyası boş/undefined dəyəri qəbul etməlidir.
- Uduzma/qələbədən sonra "Yenidən başla" düyməsi yoxdur, səhifəni yeniləmək lazımdır.
- İpucu (monitordakı ikilik kod) öz mərhələsindən əvvəl görünür.
- Son hint cavabı birbaşa deyir. Yeni versiyada 2-ci hint "demək olar cavab"dır, cavabın özü deyil.

## İş qaydası (addım-addım)
- Yalnız bu qovluqda işlə. Bu qovluqdan kənardakı fayllara toxunma.
- İşi `PLAN.md` bölmə 8-dəki "İş mərhələləri" ilə, bir-bir apar.
- Hər mərhələdən sonra:
  1. Mərhələni `PLAN.md`-də `[x]` et.
  2. Qısa Azərbaycanca mesajla commit et və push et.
  3. Nə etdiyini qısa yaz və Roya-ya nəyi yoxlamalı olduğunu de.
  4. **Dayan** və Roya "davam" yazana qədər növbəti mərhələyə keçmə.
- Hər dəyişiklikdən sonra brauzerdə yoxla: `index.html` `file://` ilə açılır, konsolda xəta yoxdur, hazır olan aktlar sona qədər keçilir.

## Git
- Müəllif yalnız bu repo üçün təyin olunub: `Röya Məhərrəmli <ryamaharram@gmail.com>`. Qlobal git ayarına toxunma.
- Aktiv `gh` hesabı (Nuxsara) bu repoya push edə bilmir. Push `mhroya` hesabının token-i ilə edilir, aktiv hesab dəyişdirilmir.
