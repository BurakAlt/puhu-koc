ŞEYTANIN AVUKATI RAPORU: Puhu Koç uzman raporlarının denetimi

## 0. Önce şunu bilin: raporların bir kısmı eski koda bakıyor
Kodu açtım. f:/lichess/index.html şu an 1237 satır. Raporlardaki satır numaraları birbirini tutmuyor; örneğin buildHunts için 864 ve 833 deniyor, oysa fonksiyon index.html:887-897 arasında. Yani raporlar farklı sürümler üzerine yazılmış ve bazı "eksik" bulgular artık geçerli değil:
- **"OAuth isteğinde scope yok" (eğitimci, mimar, ML, aile uzmanı) YANLIŞ.** index.html:1189'da `scope: 'puzzle:read'` zaten var.
- **Gerçek hata tek satır.** Bulmaca isteği index.html:979'da `fetch(...)` olarak gidiyor ve `auth()` başlığı yok. Oysa index.html:1092'deki puzzle/activity isteği başlığı gönderiyor.
- **"Veli görünümü yok" (çocuk arayüzü uzmanı, aile uzmanı) YANLIŞ.** Çarpma kilitli bir Ebeveyn sayfası var: index.html:283, 1049-1056, 1088-1132. Bu sayfa Lichess bulmaca etkinliğini de gösteriyor.
- **Doğru çıkan iddialar:**
  - themeKind ilk eşleşeni döndürüyor (index.html:956). hangingPiece teması üç türde birden kayıtlı: asili, korumasiz, bedava (index.html:325, 329, 333).
  - BOX_DAYS=[0,0,1,3,7,14] ve yanlış cevap kartı kutu 1'e indirip hemen vadeye alıyor (index.html:400-402).
  - insight() yalnız "acele" dalını biliyor (index.html:784).
  - Tehdit avında yanlış tıklamalardan sonra da yıldız veriliyor (index.html:924).
  - hataHint T.wrong'u artırmıyor (index.html:870 civarı).
- **Kısmen yanlış:** Bulmacada "Göster" ilk denemeyi bozmuyor. showFn P.wrong'u artırıyor (index.html:975), yani "ilk denemede" mesajı çıkmaz. Yine de yıldız veriliyor (index.html:958).

## 1. Hepsinin paylaştığı zayıf varsayımlar
- **8 sn'ye 5 sn verisi "tünel görüşü / Einstellung" diye okunuyor (6 uzman).** Kendim ölçtüm (veri.js, Lichess analizli oyunlar). Fark tempo içinde de duruyor: rapid'de 8,2'ye 5,6 sn (n=97 hata), blitz'te 5,8'e 4,0 sn (n=43). Ama hata yapılan hamleden önceki pozisyonun ortanca değeri |333| cp, diğer hamlelerde |560| cp. Yani "diğer" hamlelerin çoğu zaten kararlaşmış pozisyonlarda, hızlı oynanıyor ve Lichess'in kazanma şansı ölçütüyle "Blunder" sayılamıyor bile. Uzun süre önce kritik pozisyonu gösteriyor, yanlış yere bakmayı değil.
  - Sheridan & Reingold çalışması güçlü oyuncularla yapılmış, 800 puanlık çocuklarla değil.
  - "Kendi planına dalıyor" bir hipotez, bulgu değil. Bunu ancak çocuğa sorarak doğrulayabilirsiniz (bkz. bölüm 3).
- **Sınıflandırıcının etiketleri gerçek kabul ediliyor.** Bütün ağırlıklar 47/33/24 sayılarına dayanıyor. Oysa antrenör sınıflandırıcının hatalarını kendisi gösterdi: değişim hesabı yok, küçük asılı piyon büyük hatayı gölgeliyor, çatal yapan taşın güvenliğine bakılmıyor, açmaz görülmüyor. Bu sayılar yalnız yaklaşık 41 analizli oyundan geliyor.
  - 7 ile 11 arasındaki fark gürültü. Kimse elle bir örnek doğrulamadı.
  - En ucuz düzeltme: babanın rastgele 20 hatayı 30 dakikada elle etiketleyip sınıflandırıcıyla karşılaştırması.
- **Bulmaca-oyun puan farkı (1222'ye 796) bu çocuğa özgü bir teşhis sanılıyor.** Bulmaca ve oyun puanları ayrı havuzlardan, ayrı ölçeklerde hesaplanıyor. Bu farkın büyük kısmı herkeste görülebilir. Bunu destekleyen tek kaynak bir blog anekdotu (araştırmacı da öyle işaretlemiş). "Fark savunma körlüğünden geliyor" iddiasının kanıtı yok; makul bir hipotez olarak kalmalı.
- **"Tehlike yok" turu (5 uzman aynı öneri) temeldeki hatayı devralıyor.** Bu turlar hangingPieces'e dayanıyor. Antrenörün gösterdiği gibi bu fonksiyon saldıran ve koruyan taşları saymıyor ve açmazdaki koruyucuyu da koruyucu sayıyor. Değişim hesabı (SEE) düzeltilmeden "sakin" etiketi yanlış çıkar ve çocuğa "tehlike yok" yanlışı öğretilir. Önce SEE düzeltmesi, sonra bu turlar.
- **Uygulamadaki çalışmanın oyuna taşındığı varsayılıyor ama başlangıç ölçümü yok.** Değişikliklerden ÖNCE bugünkü oranlar kaydedilmeli. Yoksa sonradan hiçbir şey kanıtlanamaz.

## 2. Uzman bazında
**Eğitim bilimci**
- Kanıtsız: "Yıldız iç motivasyonu zayıflatıyor" iddiası, Deci 1999'daki *somut* beklenen ödül etkisini sembolik yıldıza aktarıyor. Aynı meta-analizde sözlü ve bilgi veren geri bildirimin etkisi olumlu. Yıldız bu ikisinin arasında duruyor. Verdiği d=-0,36 değerini doğrulamadım; kaynaktan kontrol edilmeli.
- Ters etki riski (bulmaca ayarı): sadece auth başlığı eklenirse 'easier' yaklaşık 1200'den yaklaşık 922'ye düşer, bulmacalar kolaylaşır. ML uzmanı bunu fark etmiş. Başlık eklemek ile difficulty() eşiklerini (index.html:950-954) yeniden ayarlamak aynı değişiklikte yapılmalı.
- Fazla: FSRS için inceleme kaydı tutmak. Tek çocukta 300-500 inceleme aylar sürer ve parametre uydurmanın kazancı belirsiz. BOX_DAYS'i uzatmak yeter.
- İyi ve ucuz: ipucu kullanılınca kartın kutu atlamaması.

**Satranç eğitimi araştırmacısı**
- Kanıtsız kaynaklar: Burgoyne 2019'u okumadığını kendisi yazmış ve Steps metodu kaynakları açılmamış. Bu iki dayanak çıkarılmalı.
- Doğru ve ucuz: themeKind hatası. Pickteme bir tür döndürsün; birkaç satırlık değişiklik.

**Antrenör**
- Diğerleriyle çelişiyor:
  - "addStar aynı kalsın, motivasyon korunur" diyor; eğitimci ve oyun tasarımcısı yıldızın ustalığa bağlanmasını istiyor.
  - "Savunma temalarında easiest" diyor; eğitimci yüzde 70-85 başarı hedefini öneriyor.
- Bulmaca hedefini 5'ten 3'e indirmek, 3000 bulmacayı kendi isteğiyle çözen çocuğun sevdiği şeyi kısıyor. Kanıtı yok.
- En değerli teknik bulgular onunkiler: en iyi hamlenin sorunu çözüp çözmediğinin doğrulanması, SEE, çatal yapan taşın güvenliği. Başka önerilerin hepsi bunlara bağlı.

**Çocuk arayüzü uzmanı**
- "Veli görünümü yok" ve "ham sayı yalnız veli görünümünde kalsın" eski koda dayanıyor; o görünüm zaten var.
- Fazla: renk körlüğü ve disleksi düzenlemeleri. Çocukta böyle bir tanı bilinmiyor. Ucuz kısımlar alınabilir (yazıyı en az 16px yapmak), gerisi spekülatif.
- Sesli klip önerisinin eksiği: sabit cümle sesli klipten, hamle adı (SAN) tarayıcı sesinden gelirse aynı cümlede ses değişir ve kulağa garip gelir. Klipler yalnız tam cümle olan kalıplarda (kural metinleri, övgüler) kullanılmalı.

**Yazılım mimarı**
- Ölçüm şişirilmiş: "96/151 pozisyonda eşdeğer iyi hamle var" sonucu, explain() 'diger' döndüğünde hamleyi iyi saymaya dayanıyor. Oysa 'diger', sınıflandırıcının bir şey bulamadığı anlamına geliyor; hamlenin güvenli olduğu anlamına gelmiyor. Kabul ölçütü yalnız motor farkı olmalı (antrenörün ve kendisinin önerdiği 80-100 cp).
- Tek çocuk için fazla: service worker ve vendoring, IndexedDB'ye geçiş, WASM Stockfish, CSP, ortak github.io origin'i. Ucuz olanlar yeter: anahtarlara 'puhu:' öneki, JSON yedek düğmesi, setTimeout'a jeton (gen) kontrolü.

**ML ve öğrenme analitiği**
- Kendi ölçtüğü güç hesabı kendi önerisini zayıflatıyor. %30'luk düşüşü görmek için pencere başına yaklaşık 60 analizli oyun gerekiyor (hesabı kontrol ettim: z=0,252·√n, n≈63). Çocuk ayda yaklaşık 17 oyun oynuyor ve yalnız 41'i Lichess analizli. Lichess analizine dayanan sonuç ölçütü yıllar sürer.
  - Çözüm, kimsenin birleştirmediği bir şey: davranış analistinin motorsuz ölçütleri (100 hamlede malzeme kaybı, rapid'de 6,3; 1 hamlede mata izin) bütün oyunlarda hemen hesaplanabiliyor. Sonuç ölçütü bu olmalı.
- Fazla: tema başına Elo, Lichess dashboard'undan prior, Thompson örneklemesi. Thompson'ın mevcut örneklemeden farkının küçük olduğunu kendisi kabul ediyor. Yalnız unutma (sayaçlara 0,9 çarpanı) ve yalnız yeni pozisyonu sayma kısmı alınmalı.

**Davranış analisti**
- "Mat körlüğü 20 kat eksik sayılıyor" başlığı elma ile armudu karşılaştırıyor. 4 sayısı 41 analizli oyundan, 89 sayısı 192 oyunun hepsinden ve kaybedilmiş pozisyonlardaki çaresiz hamleler de içinde. Rakibin cezalandırdığı 41 izin, mat ile biten 41 yenilgiyle aynı oyunlar. Yani bunların çoğu zaten görünen yenilgiler.
  - Önce şu süzgeçle yeniden sayılmalı: malzeme farkı -5'ten iyi olan ve her hamlenin mat olmadığı pozisyonlar.
  - Yine de bu en ucuz ve en değerli veri düzeltmesi.
- En dürüst rapor bu. Tilt etkisini ve bullet sonuçlarını n ile birlikte veriyor. Psikoloğun önerdiği "2 yenilgide dur" kuralını veriyle çürütüyor: üst üste iki yenilgiden sonra yalnız 7 oyun var.

**Spor psikoloğu**
- Zayıf kaynaklar: Breitwieser 2026 bir derleme sitesinden (ifp.nyu.edu), Rupprecht 2021 bir basın bülteninden (EurekAlert), Zen modu da 403 dönen bir sayfadan alınmış. Bunlar tam metinden doğrulanmalı.
- Fazla: kayıp sonrası duygu kontrolü ve nefes animasyonu. Çocuğun oyundan hemen sonra uygulamayı açtığına dair veri yok. 60 saniyelik oyun öncesi rutin de, ölçülemeyen bir davranışa yönelik bir ekran.

**Oyun tasarımcısı**
- Fazla: Puhu Ormanı haritası, boss savaşları, hataları yaratığa çevirmek. Tek geliştiricinin haftalarını alır. Kendi önerdiği ucuz mekanik yeterli: Tehdit avında 2 yanlış tıklamadan sonra tahta kilitlensin, yıldız verilmesin.
- "Babana meydan oku" kartı babanın satranç bildiğini varsayıyor. Aile uzmanı ise ebeveynin satranç bilmediğini varsayıyor. İkisi çelişiyor.

**Aile ve veri etiği uzmanı**
- Turnuva yolu ve notasyon modu çocuğun isteği bilinmeden kurulmuş bir hedef.
- Kid mode için iki öneri çelişiyor: çocuk arayüzü uzmanı API'den preference:read kapsamıyla okumayı, aile uzmanı elle onay kutusunu öneriyor. API yolu yeni kapsam ve yeniden giriş ister. Elle onay kutusu yeterli ve daha ucuz.
- En iyi düşük maliyetli fikir onun: cevapsız soruları yerelde kaydedip veliye göstermek. Bu, 3. soruya sunucusuz bir cevap.

## 3. Hepsinin kaçırdığı noktalar
- **Çocuğa hiç kimse sormuyor.** En ucuz ve en güçlü veri kaynağı, çocuğun kendi 5 hata pozisyonunda 15 dakika sesli düşünmesi. Böylece tehdidi görüp yanlış mı hesapladı, hiç mi bakmadı, bunu ayırt edebilirsiniz. "Tünel görüşü" ve "savunma körlüğü" teorilerini birkaç dakikada doğrular ya da çürütür.
- **Uygulamanın gerçekte nasıl kullanıldığı bilinmiyor.** Hangi mod açılıyor, nerede bırakılıyor, günde kaç dakika? Motivasyonla ilgili bütün öneriler tahmin. Ucuz yol: localStorage'da mod başına açılış ve bitirme sayacı.
- **Kontrol rutini için beş farklı ad önerildi:** "3 soru", "Son kontrol", "RAKİP SIRASI / DUR-BAK-SOR", "Rakip gözlüğü", "Son bakış". Hepsi aynı anda eklenirse 9 kuraldan daha kötü bir sonuç çıkar. TEK bir cümle seçilip her yerde aynısı kullanılmalı.
- **Öncelik eksik.** Yaklaşık 80 öneri var ve çoğu "S" efor olarak işaretli; toplamı tek bir geliştirici için aylar demek. Ayrıca metin değişikliklerinin çoğu e2e_test.mjs'teki metin eşleşmelerini bozar.
- **Rakip düzeyi hesaba katılmıyor.** Bu seviyedeki rakipler 89 mat fırsatının 48'ini kaçırıyor. Çocuğun hataları yarı yarıya cezasız kalıyor, yani oyun sonuçları hata düzeltmesine yavaş tepki verir. Puan, ilerlemeyi ölçmek için kötü bir ölçüt; bu durum ML ve analist görüşünü güçlendiriyor.

## 4. Önerilen ucuz sıra (fazla mühendislik olmadan)
1. index.html:979'a `{ headers: auth() }` ekle ve difficulty() eşiklerini aynı anda yeniden ayarla.
2. Pickteme bir tür döndürsün (themeKind hatası düzelir). İpucu kullanılınca kart kutu atlamasın. Tehdit avında yanlış tıklamadan sonra yıldız verilmesin.
3. Bugünkü motorsuz ölçütleri başlangıç olarak kaydet: 100 hamlede malzeme kaybı, 1 hamlede mata izin (süzgeçli).
4. hangingPieces'e SEE ekle, ardından "Tehlike yok" turlarını aç.
5. insight()'a ters dalı ekle (t.bl > t.ok) ve TEK bir kontrol cümlesi seç.
6. Çocukla 15 dakikalık sesli düşünme oturumu yap ve 20 hatayı elle etiketle. Kalan her şey bu sonuçlara göre seçilsin.

## Ölçümle ilgili
- Ölçüm betiği: F:\Temp\claude\f200e88c1f16f789\26b02d28-2780-4983-b98a-443f595de4cd\scratchpad\rt\t.cjs (veri.js okunuyor, hiçbir şey dışarı gönderilmiyor).
- Hiçbir web aramasına kişisel veri girmedim. Bu raporda yeni bir dış kaynak açmadım; kaynaklarla ilgili yorumlar raporların kendi beyanlarına dayanıyor.