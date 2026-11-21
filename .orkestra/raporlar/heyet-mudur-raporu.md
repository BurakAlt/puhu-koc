# Puhu Koç: Uzman heyeti müdür raporu (veliye)

*Satır numaraları bugünkü f:/lichess/index.html dosyasından yeniden doğrulandı (1237 satır). Bazı uzman raporları eski bir sürümü okumuş. Aşağıda yalnız şu anki koda uyan iddialar duruyor.*

## 1. Yönetici özeti

Uygulamanın iskeleti öğrenme bilimiyle uyumlu: çocuk kendi hatalarını geri çağırıyor, Leitner tekrarı var, hatanın nedeni açıklanıyor ve sistem uyarlanıyor. Heyetin vardığı ortak sonuç şu: **asıl eksik yeni özellik değil, ölçüm.** Uygulama çocuğun ilerlemesini bugün yanlış ölçüyor:

1. **Bulmaca zorluğu çocuğa göre değil, 1500 puana göre ayarlanıyor.** OAuth isteği `puzzle:read` kapsamını zaten alıyor (index.html:1189). Ama bulmaca isteği token'ı göndermiyor (index.html:979). Ebeveyn panelindeki istek ise gönderiyor (index.html:1092). Lichess de kimliksiz istekte zorluğu 1500'e göre kuruyor ve çözülmüş bulmacaları yeniden verebiliyor.
2. **Ustalık ve yıldız sinyalleri kirli:**
   - `themeKind` ilk eşleşen türü döndürüyor (index.html:956). Bu yüzden "korumasız" ve "bedava" türleri bulmacadan hiç ustalık puanı almıyor.
   - İpucuyla çözülen soru "ilk denemede doğru" sayılıyor (index.html:874-878 ile 865).
   - Tehdit avında yanlış tıklamalardan sonra da yıldız veriliyor (index.html:924).
   - Aynı pozisyonun tekrarı da ustalığa yazılıyor, yani ezber ustalık gibi görünüyor (index.html:856).
3. **Hata profilinin kendisi belirsiz.** 47/33/24 sayıları yaklaşık 41 analizli oyundan ve bilinen eksikleri olan bir sınıflandırıcıdan geliyor. Bu sınıflandırıcı değişim hesabı yapmıyor, küçük bir asılı piyonu büyük hatanın önüne koyabiliyor ve çatal yapan taşın kendisinin alınabildiğine bakmıyor. Motor da yalnız kaybedilen oyunlara bakıyor (index.html:815).
4. **Uygulamanın işe yarayıp yaramadığını gösteren bir başlangıç ölçümü yok.**

Bu yüzden önerilen sıra şöyle: **önce ölçümü düzeltin (P1-P5), sonra yeni alıştırmaları ekleyin (P6-P9), en son süs ve konfor işlerine geçin.** İlk beş önerinin toplamı tek bir geliştirici için birkaç akşamlık iş.

Kırmızı takımın en önemli uyarısı: "Çocuk hata yaptığı hamlede uzun düşünüyor (8 sn'ye karşı 5 sn), demek ki tünel görüşü var" yorumu **bir hipotez, kanıtlanmış teşhis değil.** Kırmızı takımın ölçümüne göre hata hamlelerinden önceki pozisyonların ortanca değeri yaklaşık |333| cp, diğer hamlelerde |560| cp. Yani "diğer" hamlelerin çoğu zaten kararlaşmış pozisyonlarda hızlıca oynanmış. Uzun süre bu durumda yalnızca pozisyonun kritik olduğunu da gösterebilir. Bunu ayırt etmenin en ucuz yolu çocukla 15 dakika oturmak (P4).

## 2. Temalara göre bulgular (yinelenenler birleştirildi)

### A. Ölçüm ve uyarlama hataları (en yüksek öncelik)
- **Bulmaca kalibrasyonu (eğitimci, mimar, ML, antrenör):** index.html:979'da `headers: auth()` yok. Dikkat: yalnız token eklenirse `difficulty()` (index.html:950-955) içindeki 'easier' seviyesi yaklaşık 1200'den yaklaşık 922'ye düşer. Bu, ML uzmanının ve kırmızı takımın yakaladığı bir tuzak. Token ve eşikler aynı değişiklikte ayarlanmalı.
- **Ustalık hatası (araştırmacı, ML):** `themeKind` hangingPiece temasını her seferinde 'asili' türüne yazıyor. Aynı sorun tehdit ve mateIn1 eşlemelerinde de var.
- **İpucu ölçümü bozuyor (eğitimci, oyun tasarımcısı, araştırmacı):** Hatalarım ve Bulmaca modlarındaki ipucu deneme sayacını artırmıyor. Tehdit avında yanlış tıklamaya rağmen yıldız veriliyor (index.html:924). Bulmacadaki "Göster" düğmesi P.wrong'u artırıyor, yani orada sorun yok (kırmızı takım bu kısmı düzeltti).
- **Leitner (eğitimci, ML):** `BOX_DAYS=[0,0,1,3,7,14]` (index.html:400). Kutu 1 ve 2'nin aralığı 0 gün olduğu için aynı oturumda iki doğruyla kutu 3'e çıkılıyor. Yanlış cevaplanan kart hemen yeniden gelebiliyor. Kart anahtarı tek bir pozisyon, bu da ezberi kolaylaştırıyor.

### B. Sınıflandırıcının doğruluğu (antrenör; diğer her şey buna dayanıyor)
- `hangingPieces` (index.html:345) bir taşa kaç rakip taşın saldırdığını ve kaç taşın koruduğunu saymıyor. Açmazdaki taşı ve geri alamayacak şahı koruyucu sayıyor.
- `explain` (index.html:358) en iyi hamlenin bulunan sorunu gerçekten çözdüğünü doğrulamıyor. Değer gözetmeden ilk asılı taşı (piyon dahil) neden olarak alıyor. Çatal kuralı, çatal yapan taşın kendisinin alınabildiğine bakmıyor.
- Sonuç: "Tehlike yok" turları gibi yeni modlar bu fonksiyonla kurulursa çocuğa yanlış "güvenli" etiketi öğretilir. **Önce SEE (basit değişim hesabı), sonra yeni modlar.**

### C. Uyarısız tehlike: bulmaca ile oyun arasındaki köprü (6 uzman)
Bütün alıştırmalar "burada bir şey var" diye önceden haber veriyor: buildHunts yalnız tek tür hedefi olan pozisyonları alıyor (index.html:896), bulmacalar tek temalı ve bloklu geliyor. Oyunda ise kimse haber vermiyor. Önerilen çözüm, karışık sunum ve "tehlike var mı, yok mu" ayrımını çalıştırmak (Rohrer ve Taylor 2007; Kornell ve Bjork 2008).

Kırmızı takımın uyarısı: 1222'ye 796 farkının bir kısmı iki puan havuzunun ayrı ölçeklerde olmasından gelir. "Fark savunma körlüğünden geliyor" iddiası makul bir hipotez, kanıtlanmış değil.

### D. Hataların türü: savunma
156 hatanın yaklaşık üçte ikisi ya da dörtte üçü rakibin imkânını görmemekten geliyor. Kod ise iki savunma hatasını saldırı bulmacasına bağlıyor: asili ve korumasiz türleri 'hangingPiece' temasına eşli. Lichess'teki hangingPiece bulmacası rakibin asılı taşını almayı çalıştırır, yani hatanın tersini. Bu türler `defensiveMove` temasına bağlanmalı ya da doğru hamleden sonra "rakip şimdi ne yapar?" diye sorulmalı.

### E. Pat ve kazanılmış oyunu bitirme
- Uygulamanın saydığı: 7 kazanılmış oyun pat ile bitti.
- Davranış analistinin saydığı: +9 malzeme öndeyken 53 oyunun 11'i kazanılamadı, 5'i pat oldu. Patlar uzun oyun sonlarında, 52. ile 146. yarım hamleler arasında olmuş.
- Uygulamadaki `makeStalemateTrap` (index.html:422) yalnız tek hamlelik bir soru soruyor. Asıl eksik süreç: vezirle (ya da kaleyle) şahı köşeye sıkıştırıp pat yapmadan mat etmek.

### F. Duygu dili ve ödül
- Her yanlışta Puhu üzgün yüz ('sad') yapıyor ve sesli olarak "olmaz" diyor (index.html:871, 922, 996).
- Doğru cevapta kişiye yönelik "aferin" veriliyor ve hatanın nedeni aynı cümlede söyleniyor (index.html:866). Böylece çocuğun nedeni kendisinin bulmasına fırsat kalmıyor.
- Kaynaklar: Hattie ve Timperley 2007, Kamins ve Dweck 1999, Shute 2008.
- Kırmızı takımın düzeltmesi: Deci ve arkadaşlarının 1999 bulgusu *somut ve beklenen* ödüller içindir. Sembolik yıldız bununla bilgi veren geri bildirim arasında durur. Yıldızı silmeyin, ustalığa bağlayın.

### G. Davranış verisinden çıkanlar (motorsuz, 192 canlı oyun)
- Rapid yenilgilerinin 42/51'inde saatin yarısından azı kullanılmış.
- Bullet: 8 oyun, 0 galibiyet, 100 hamlede 18,2 malzeme kaybı (rapid'de 6,3).
- Tilt etkisi görünmüyor: yenilgiden sonraki skor %46, beklenti %45.
- 8 oyun yarıda bırakılmış (çocuk saati bitene kadar oynamamış).
- Kırmızı takımın düzeltmesi: "mat körlüğü 20 kat eksik sayılıyor" başlığı abartılı. 4 sayısı 41 analizli oyundan, 89 sayısı 192 oyunun hepsinden geliyor ve kaybedilmiş pozisyonlardaki çaresiz hamleleri de içeriyor. Yine de motorsuz mat taraması bu raporun en ucuz ve en değerli veri düzeltmesi.

### H. Sağlamlık ve güvenlik (mimar, aile uzmanı)
- Bir yıl geçerli token, başka Pages projeleriyle paylaşılan `*.github.io` origin'inde ve öneksiz bir anahtarda duruyor (index.html:1203).
- Bulmaca ve Hatalarım'da setTimeout yarışları var: çocuk hızlı tıklarsa tahta bozulabiliyor.
- İlerleme verisi yedeklenmiyor. Safari 7 gün sonra siliyor, kota dolunca yazma hatası sessizce yutuluyor.
- Rakip kullanıcı adları çocuğa gösteriliyor.
- Lichess çocuk modunun açık olup olmadığı hiç kontrol edilmiyor.

## 3. Kırmızı takımın çürüttüğü ya da ertelediğimiz öneriler
- **"OAuth isteğinde scope yok" YANLIŞ:** index.html:1189'da `scope: 'puzzle:read'` var. Gerçek hata yalnız index.html:979'daki eksik token başlığı.
- **"Veli görünümü yok" YANLIŞ:** Çarpma sorusuyla kilitlenen bir Ebeveyn paneli var (index.html:284, 1040 ve sonrası).
- **"96/151 pozisyonda eşdeğer iyi hamle var" ölçümü şişik:** explain()'in 'diger' döndürmesi hamlenin güvenli olduğunu değil, sınıflandırıcının bir şey bulamadığını gösterir. Kabul ölçütü yalnız motor farkı olabilir (P9).
- **"2 yenilgiden sonra dur" kuralı veriyle çürütüldü:** Üst üste iki yenilgiden sonra oynanan yalnız 7 oyun var ve tilt görünmüyor.
- **Ertelendi (fazla mühendislik):**
  - Tam pekiştirmeli öğrenme ya da DKT.
  - FSRS için inceleme kaydı (tek çocukta 300-500 inceleme aylar sürer).
  - Tema başına Elo, Lichess panosundan ön bilgi, Thompson örneklemesi. ML uzmanı da kazancın küçük olduğunu kabul ediyor.
  - Service worker, IndexedDB, WASM Stockfish, CSP.
  - Puhu Ormanı haritası, boss savaşları, hataları yaratığa çevirmek.
  - Taze kayıp sonrası duygu kontrolü ve 60 saniyelik oyun öncesi rutin (çocuğun oyundan hemen sonra uygulamayı açtığına dair veri yok).
- **Kanıtsız:**
  - Bulmaca hedefini 5'ten 3'e indirmek: çocuğun en sevdiği şeyi kısıyor.
  - Renk körlüğü ve disleksi düzenlemeleri: tanı yok. Yalnız ucuz kısmı (yazıları en az 16px yapmak) alınabilir.
  - Turnuva ve notasyon modu: çocuğun isteği bilinmiyor. Veliye yalnız bilgi olarak duruyor.
- **Kid mode'u API ile (preference:read) okumak gereksiz:** Yeni kapsam ve yeniden giriş ister. Velinin elle işaretlediği bir kontrol listesi yeterli.
- **Dayanaktan çıkarılan kaynaklar:**
  - Burgoyne 2019: uzman tam metni okumadığını kendisi yazmış.
  - Steps Metodu: kaynak sayfaları açılamadı.
  - Psikoloğun basın bülteni ve derleme sitesi kaynakları (EurekAlert, ifp.nyu.edu) ile 403 dönen Zen modu sayfası yalnız destekleyici olarak kaldı.

## 4. Sahibin dört sorusuna açık cevaplar

### (1) Pekiştirmeli öğrenme burada nasıl yapılır?
**Makine öğrenmesi anlamındaki RL'ye gerek yok ve bu ölçekte yapılamaz.** Tam RL binlerce öğrenci ve tanımlı bir ödül ister. Burada 1 öğrenci, 9 tür ve 156 hata var. Literatür de sığ modellerin derin bilgi izleme (DKT) kadar iyi olduğunu gösteriyor (Khajah ve ark. 2016; Wilson ve ark. 2016).

Uygulamada zaten RL'ye en yakın bir parça var: `pickTheme` (index.html:409) bir haydut algoritması (bandit) gibi çalışıyor. Yapılacak üç şey var:
- (a) **Ödül sinyalini temizleyin (P2):** ipucuyla çözülen soru ve ezberlenmiş tekrar "başarı" sayılmasın, ustalık puanı doğru türe yazılsın.
- (b) **Asıl ödül sinyalini oyunlara bağlayın (P3):** her hafta yeni oyunlarda "100 hamlede malzeme kaybı" ve "1 hamlede mata izin" oranını ölçün, pickTheme'e düşük bir katsayıyla katın. Bu, ZPDES'in "öğrenme ilerlemesi" ödülünün dürüst ve küçük karşılığı (Clement ve ark. 2015).
- (c) **Davranışsal pekiştirme:** yıldızı ilk denemede, kendi başına bulunan cevaba ve kontrol davranışına verin. Sandık ya da rastgele ganimet gibi değişken oranlı ödüller kullanmayın.

Not: ML uzmanının hesabına göre analizli oyunlarla %30'luk bir iyileşmeyi görmek pencere başına yaklaşık 60 analizli oyun ister. Motorsuz ölçüt bütün oyunlarda hemen hesaplanabildiği için tercih edilmeli.

### (2) Tarayıcı sesinden daha iyi ücretsiz ses
Chrome'da Windows'un eski "Tolga" sesi var. Edge'in doğal sesleri bulutta çalışıyor ve yalnız Edge'de geliyor (index.html:575'teki voiceScore bunu zaten tercih ediyor). Dürüst sıralama:
1. **Önceden kaydedilmiş klipler (önerilen):**
   - Sabit cümleler (dokuz altın kural, sözlük cevapları, övgüler) bir kez nöral sesle mp3'e çevrilir. Azure F0 ücretsiz katmanı ayda 0,5 milyon karakter veriyor; tüm metin bunun çok küçük bir kısmı.
   - `speak()` (index.html:584) önce klip arar, bulamazsa tarayıcı sesine düşer.
   - Klipler yalnız **tam cümle** kalıplarında kullanılmalı. Hamle adı (SAN) ya da kare adı yarısı klip, yarısı tarayıcı sesiyle birleştirilirse aynı cümlede ses değişir (kırmızı takımın uyarısı).
   - Azure şartlarının üretilen sesin dağıtımına izin verip vermediğini kayıttan önce kontrol edin. Resmî olmayan edge-tts betiği gri alanda, kullanmayın.
2. **Velinin kendi sesi:** yaklaşık 30 övgü ve kural cümlesi MediaRecorder ile kaydedilir. Duygusal bağı en güçlü seçenek bu.
3. **Piper WASM (vits-web):** Türkçede yalnız tr_TR-dfki-medium sesi var (yaklaşık 63 MB, erkek ve robotik). Telefonda ilk yükleme ağır olur.
4. **Çalışma anında bulut TTS:** sunucu olmadığı için API anahtarı sayfada açık kalır. Önerilmez.

Ek olarak "Tekrar dinle" düğmesi ekleyin ve Altın kuralı her yanlışta okumayın.

### (3) Çocuk Puhu'ya serbest soruyu nasıl sorar?
Sunucusuz ve gizlilik dostu yol:
- (a) `answer()` (index.html:478) karşılaştırmadan önce Türkçe karakterleri sadeleştirsin (ç→c, ş→s, ı→i ...). 4 harf ve üstü kelimelerde tek harflik yazım hatasına (Levenshtein ≤1) izin versin. Bugün "catal" ya da "acmaz" yazan çocuk "Bunu henüz bilmiyorum" cevabı alıyor (index.html:1035).
- (b) Cevap bulunamazsa 12 konuyu sesli saymak yerine 3 öneri düğmesi gösterilsin.
- (c) **Cevapsız sorular yerelde kaydedilsin ve Ebeveyn panelinde "Puhu'nun bilemediği sorular" olarak listelensin.** Veli cevabı çocukla birlikte arar, sözlük de çocuğun kendi dilinden büyür. Puhu "Bunu ailene soralım, not aldım" desin.
- **Bulut LLM:** yalnız veli onayıyla düşünülmeli. Kullanıcı adı ya da isim asla gönderilmemeli. Sunucu olmadığı için anahtar açıkta kalır, bu yüzden bir aracı sunucu (proxy) gerekir. Şimdilik önermiyoruz.
- **Sesle soru:** Chrome'un konuşma tanıması sesi Google'a gönderir. Eklenecekse veliye açıkça söylenmeli.

### (4) Eksik yetkinlikler
1. **Hamle sonrası güvenlik kontrolü** (blunder-check): "Bu hamleden sonra rakip ne yapar?" alışkanlığı. Bugün yalnız ŞAT var ve o da rakibi en sona koyuyor (index.html:474).
2. **Savunma:** rakibin planını okumak ve korumasız kalan taşı görmek. Mevcut alıştırmalar neredeyse hep saldırı çalıştırıyor.
3. **Değişim hesabı:** "Kaç taş saldırıyor, kaç taş koruyor?" Bu, 800 seviyesinin tipik kaybı ve uygulamanın kendisinde de eksik (P5).
4. **Kazanılmış oyunu bitirme:** vezirle ve kaleyle mat tekniği, pat bilinci.
5. **Tehlikeyi kimse haber vermeden fark etmek:** "tehlike yok" kararını da verebilmek.
6. **Oyun sonrası kendi incelemesi:** motor sonucunu görmeden önce kendi hatasını tahmin etmek.
7. *Veliye bilgi:* uzun tempo, notasyon yazma ve yüz yüze turnuva deneyimi. TSF küçükler şampiyonası 90+30 tempoyla oynanıyor. Bu, çocuğun isteğine bağlı bir hedef.

## 5. Görmediğiniz açılar
- **Rakipler hataları affediyor.** Bu seviyedeki rakipler çocuğa verilen 89 mat fırsatının 48'ini kaçırmış. Yani hataların yaklaşık yarısı cezasız kalıyor. Hata düzeldiğinde puan ve sonuçlar bunu çok geç ve gürültülü gösterir. **Puan hedefi koymayın;** ilerlemeyi hamle başına hata oranıyla izleyin.
- **Bütün öncelikler küçük ve yanlı bir örnekleme dayanıyor.** Hata profili yaklaşık 41 analizli oyundan geliyor. Bu analizler büyük olasılıkla kayıp oyunlarda istenmiş ve motor da yalnız kayıplara bakıyor (index.html:815). Kazanılmış ama patla biten oyunlar ve rakibin kaçırdığı matlar profile hiç girmiyor. Babanın 30 dakikada rastgele 20 hatayı elle etiketlemesi bütün sistemi kalibre eder.
- **3000 bulmaca aynı zamanda bir koşullandırma.** Çocuk binlerce kez "burada bir şey var, bul" kalıbıyla çalışmış. Uygulama da şu an aynı kalıbı tekrarlıyor. Yeni bulmaca çözmek yerine "tehlike var mı?" kararını vermek ona en yabancı beceri olabilir.
- **"Yavaş oyna" demeyin, "kontrol et" deyin.** Saatin yarısı kullanılmadan kalıyor, ama hızlı oynanan oyunlar daha iyi sonuçlanmış. Bu büyük olasılıkla ters nedensellik: kolay oyunlar hızlı oynanır. Süre öğüdü veriyle çelişir, kontrol alışkanlığı çelişmez.
- **Tilt yok, bu bir güç.** Çocuk hata yaptıktan sonra dağılmıyor (ilk malzeme kaybından sonra kayıp oranı %7,3, genel oran %6,6). Bunu ona söylemek de bir pekiştirme.
- **Bullet açıkça zararlı:** 8 oyun, 0 galibiyet. Yasaklamak yerine bilgi verin: "rapid'de skorun %52".
- **8 yarım bırakılmış oyun** var, bunlardan 3'ü aynı haftada. İnternet kopması mı, sıkılma mı, başka bir şey mi? Bu bir veri sorusu değil, sofra sorusu.
- **Kimse çocuğa sormadı.** "Tünel görüşü", "savunma körlüğü" ve "yanlış hesap" teorilerinin hepsi, çocuğun kendi 5 hata pozisyonunda 15 dakika sesli düşünmesiyle doğrulanabilir ya da çürütülebilir. Bu, en ucuz ve en güçlü veri.
- **Uygulamanın nasıl kullanıldığını bilmiyoruz.** Hangi mod açılıyor, nerede bırakılıyor? Motivasyonla ilgili bütün öneriler bu bilgi olmadan tahmin. Mod başına açılış ve bitirme sayacı ucuz bir çözüm.
- **Beş uzman aynı rutine beş farklı ad verdi:** "3 soru", "Son kontrol", "DUR-BAK-SOR", "Rakip gözlüğü", "Son bakış". Hepsi eklenirse çocuk 9 kuraldan daha kötü bir duruma düşer. **TEK bir cümle** seçin ve uygulamanın her yerinde, sofrada da onu kullanın.
- **Öğretmen rolü (protégé etkisi).** Çocuğun haftada bir Hatalarım'dan 2 pozisyonu veliye "öğretmesi", bir algoritmadan daha güçlü bir pekiştireç olabilir. Satranç bilmeyen bir veli için soru basit: "Hamleden önce bana sor: O kareyi kim görüyor?" Bu çocuk için en güçlü ödül muhtemelen yıldız değil, ebeveynin ilgisi.
- **Başka çocukların verisi.** Oyun önbelleğinde ve ekranda rakip kullanıcı adları var. Yedeğe ve paylaşım bağlantılarına yalnız FEN girsin.
- **Seri ve "Serbest bulmaca çöz" kancası** (index.html:617, 638) ekran süresini kayıp korkusuyla uzatıyor. Amaç ekran süresi değil, gerçek oyuna geçiş.
- **Uygulamanın uzun vadeli rolü.** Yaklaşık 1200 rapid puanından sonra kural tabanlı sınıflandırıcının yerini bir kulüp hocası almalı. Puhu'nun hedefi "hocaya veri veren ev ödevi aracı" olarak yazılı tutulmalı.
- **Ucuz bir ısınma deneyi.** Günün ilk oyunu biraz zayıf (zayıf bir sinyal). "Lichess'te oynamadan önce 5 Tehdit avı" kuralı zararsız; 30 gün sonra yeniden ölçün.

## 6. Kaynaklar (heyetin açıp kullandığı)
- Shute 2008: https://andymatuschak.org/files/papers/Shute%20-%202008%20-%20Focus%20on%20Formative%20Feedback.pdf
- Hattie & Timperley 2007: https://www.uky.edu/~gmswan3/575/Hattie_Timperly_2007.pdf
- Deci, Koestner & Ryan 1999: https://leeds-faculty.colorado.edu/dahe7472/deci%201999.pdf
- Mueller & Dweck 1998: https://www.columbia.edu/cu/psychology/courses/3615/Readings/Mueller_Dweck.pdf
- Kamins & Dweck 1999: https://pubmed.ncbi.nlm.nih.gov/10380873/
- Rohrer & Hartwig: https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-spaced-and-interleaved-mathematics-practice-rohrer-hartwig.pdf
- Rohrer & Taylor 2007: https://digitalcommons.usf.edu/psy_facpub/1767/
- Kornell & Bjork 2008: https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Kornell_Bjork_2008_PsychScience.pdf
- Kalyuga 2007: https://www.uky.edu/~gmswan3/EDC608/Kalyuga2007_Article_ExpertiseReversalEffectAndItsI.pdf
- Roediger & Karpicke 2006: https://profiles.wustl.edu/en/publications/test-enhanced-learning-taking-memory-tests-improves-long-term-ret/
- Clement ve ark. 2015 (ZPDES): https://arxiv.org/abs/1310.3174
- Khajah, Lindsey, Mozer 2016: https://arxiv.org/abs/1604.02416
- Wilson ve ark. 2016: https://arxiv.org/abs/1604.02336
- Wilson ve ark. 2019 (%85 kuralı): https://pmc.ncbi.nlm.nih.gov/articles/PMC6831579
- Pelánek 2016: https://muni.cz/en/research/publications/1376317
- Tipton ve ark. 2023: https://pmc.ncbi.nlm.nih.gov/articles/PMC10495100/
- UCLA SMHP oyunlaştırma özeti: https://www.smhp.psych.ucla.edu/pdfdocs/gamil.pdf
- FSRS: https://www.github.com/open-spaced-repetition/free-spaced-repetition-scheduler
- Sheridan & Reingold 2013: https://pmc.ncbi.nlm.nih.gov/articles/PMC3790829/
- Sala, Foley & Gobet 2017: https://pmc.ncbi.nlm.nih.gov/articles/PMC5322219/
- Chase & Simon 1973 (özet notu): https://notes.andymatuschak.org/Chase_and_Simon_-_Perception_in_chess
- Heisman, güvenlik kontrolü: https://www.chess.com/blog/danheisman/checking-for-safety-requires-more-than-using-tactical-vision
- Campitelli & Gobet (ChessBase): https://en.chessbase.com/post/handedne-practice-and-talent-in-che
- Bulmaca-oyun farkı (blog, yalnız anekdot): https://www.chess.com/blog/MukulThapachess1010/the-puzzle-game-disconnect-why-your-1800-puzzle-rating-doesnt-match-your-800-game-rating
- Lichess API, puzzle/next: https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/tags/puzzles/api-puzzle-next.yaml
- Lichess API, puzzle dashboard: https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/tags/puzzles/api-puzzle-dashboard-days.yaml
- Lichess PuzzlePerformance şeması: https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/schemas/PuzzlePerformance.yaml
- Lichess API genel şartname (token ömrü, istek sınırı): https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/lichess-api.yaml
- Lichess API, account/kid: https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/tags/account/api-account-kid.yaml
- lila PuzzleDifficulty.scala: https://raw.githubusercontent.com/lichess-org/lila/master/modules/puzzle/src/main/PuzzleDifficulty.scala
- lila puzzleTheme.xml: https://raw.githubusercontent.com/lichess-org/lila/master/translation/source/puzzleTheme.xml
- lila Advice.scala: https://raw.githubusercontent.com/lichess-org/lila/master/modules/tree/src/main/Advice.scala
- lila site.xml (Kid mode): https://raw.githubusercontent.com/lichess-org/lila/master/translation/source/site.xml
- Lichess bulmaca API örnek yanıtı: https://lichess.org/api/puzzle/next?angle=fork&difficulty=easier
- Lichess Practice: https://lichess.org/practice
- Piper Türkçe sesler: https://huggingface.co/rhasspy/piper-voices/tree/main/tr/tr_TR
- Piper tr_TR dfki: https://huggingface.co/rhasspy/piper-voices/tree/main/tr/tr_TR/dfki
- vits-web: https://github.com/diffusionstudio/vits-web
- Azure Speech fiyatlandırma: https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/
- Edge bulut sesleri: https://blogs.windows.com/msedgedev/2019/08/14/cloud-powered-voices-microsoft-edge-chromium/
- MDN boundary olayı: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/boundary_event
- WCAG 1.4.1 (renk): https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- WCAG 2.5.8 (hedef boyutu): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Dyslexia Scotland: https://dyslexiascotland.org.uk/dyslexia-friendly-typed-formats
- WebKit 7 günlük depolama sınırı: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- Ryan, Rigby, Przybylski 2006: https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf
- Dan Cook, Chemistry of Game Design: https://www.gamedeveloper.com/design/the-chemistry-of-game-design
- Duolingo, seri ve Streak Freeze: https://blog.duolingo.com/how-duolingo-streak-builds-habit/
- Overjustification etkisi (Wikipedia): https://en.wikipedia.org/wiki/Overjustification_effect
- Desirable difficulty (Wikipedia): https://en.wikipedia.org/wiki/Desirable_difficulty
- Harwood ve ark. 2015: https://researchportal.bath.ac.uk/en/publications/a-systematic-review-of-the-intrapersonal-correlates-of-motivation/
- Hatzigeorgiadis ve ark. 2011 (APS haberi): https://www.psychologicalscience.org/index.php/news/releases/thoughts-that-win.html
- (Zayıf kaynak, yalnız destekleyici) Rupprecht ve ark. 2021, basın bülteni: https://www.eurekalert.org/news-releases/934597
- (Zayıf kaynak, yalnız destekleyici) Breitwieser ve ark. 2026, derleme sitesi: https://ifp.nyu.edu/2026/meta-analyses-systematic-reviews/bjop-70065-2/
- (403 döndü, yalnız arama özeti) Lichess Zen modu forumu: https://lichess.org/forum/lichess-feedback/what-is-zen-mode
- Chase ve ark. 2009, protégé etkisi (Crossref künyesi): https://api.crossref.org/works/10.1007/s10956-009-9180-4
- KVKK Kurul kararı 2020/622 değerlendirmesi: https://www.hukukihaber.net/gdpr-ve-kvkk-bakimindan-cocuklarin-kisisel-verilerinin-korunmasi-ve-konuya-iliskin-kurul-kararinin-degerlendirilmesi
- TSF 2025-2026 Küçükler Şampiyonası yönergesi: https://tsf-s3.tsf.org.tr/tsf/kaynaklar/belgeler/1979-2025-2026-turkiye-kucukler-satranc-sampiyonasi.pdf
- Sporx, şampiyona haberi: https://www.sporx.com/turkiye-kucukler-ve-yildizlar-satranc-sampiyonasi-sona-erdi-SXHBQ1149632SXQ
- (Okunamadı, dayanak değil) Burgoyne ve ark. 2019: https://englelab.gatech.edu/articles/2019/Burgoyne_et_al_2019_AJP.pdf
