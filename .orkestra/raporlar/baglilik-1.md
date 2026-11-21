# Puhu Koç: ürün stratejisti görüşü (edtech, Türkiye)

## 0. Kısa hüküm
Davranış bilimcinin önerisi çocuk için doğru yönde. "Bir lokma" günü, dondurma, suçluluk dili yok, sağlıklı durak: bunların hepsine katılıyorum. Ürün olarak ise üç eksiği var.
1. **Parayı ödeyen kişi (veli, koç) önerinin merkezinde yok.** Aile köşesi 12. madde olarak sona kalmış. Ürünleşmede 1. sıraya çıkmalı.
2. **Asıl risk bağlılık değil, platform ve lisans.** Uygulama GPL lisanslı bileşenlere ve Lichess'e (16 yaş kuralı, ücretsiz rakip özellikler) dayanıyor. Bunlar ürünleşmeden önce çözülmeli.
3. **15 mekanik, 3 aylık bir MVP için fazla.** Tutmayı gerçekten etkileyen 4 kaldıraç var, gerisi sonraya kalabilir.

## 1. Önerinin ürün açısından eleştirisi
- **Satır numaraları bayat.** Kodda `addStar` 612. satırda, `streak()` 617'de, "Bugünlük bitti! Serbest bulmaca çöz" düğmesi 638'de, `RANKS` (Şah=320) 606'da duruyor. Önerinin tespitleri doğru, yalnız konumlar kaymış.
- **Kuzey yıldızı metriği iyi bir ürün metriği, ama geç sinyal veriyor.** "Oyun başına blunder eğilimi" veliye satılacak kanıtın ta kendisi, bu yüzden veli raporunun manşeti olmalı. Haftalık kararlar için ise öncü bir metrik gerekir: haftalık aktif gün sayısı ve D7. Blunder eğilimi 28 günde ve çocuk oynadıkça oynamaya bağlı olarak oynar.
- **Asıl döngü (3. mekanik), çocuğun Lichess'te oynamasına bağlı.** Lichess kullanım koşullarının 16 yaş sınırı koyduğu, altındakilerin yalnız kid mode ile ya da veli gözetimi ve onayıyla kullanabileceği aktarılıyor (forumdan alıntı, resmi sayfa 403 verdi: https://lichess.org/forum/off-topic-discussion/what-is-the-age-limit-for-kid-mode-and-is-there-a-age-limit-for-posting-forums). Ürün 10 yaşındaki çocuğa "Lichess'te oyna" diyorsa, veli onboarding'i bu onayı açıkça istemeli.
- **Ana özelliğin ücretsiz bir karşılığı var.** Lichess'in "Learn from your mistakes" özelliği ücretsiz ve sınırsız (https://lichess.org/blog/WFvLpiQAACMA8e9D/learn-from-your-mistakes, arama özeti). Puhu'nun farkı tek oyunluk tekrar olamaz. Farkı şu üçü yapar: **oyunlar arası Leitner destesi, Türkçe çocuk anlatımı ve veli raporu.** Lichess forumunda bunu isteyen kullanıcılar var: "create learn from your mistakes across all games" (https://lichess.org/forum/lichess-feedback/create-learn-from-your-mistakes-across-all-games, arama özeti). Konumlandırma buradan kurulmalı.
- **"Tehdit dedektörü" (4. mekanik) teknik olarak pahalı.** Her hamlede "rakibin tehdidini kaçırdı mı" sorusunu yanıtlamak, mevcut asm.js Stockfish 10 ve derinlik 10 ile (satır 789-793) hamle başına iki ayrı değerlendirme ister (null-move karşılaştırması). Bu, çocuğun telefonunda yavaş çalışır. MVP için daha ucuz yolu öneriyorum: Lichess'in kendi `analysis` alanındaki blunder'lardan "rakibin bir sonraki hamlesi taş kazandırıyor mu" sezgisini çıkarmak.
- **Takım (13) ve sürpriz soru (9) MVP'de olmamalı.** Takım, çocuklar arasında temas, moderasyon ve backend demek. Yalnız koçun kurduğu sınıf içinde olmalı. Sürpriz sorunun tutmaya etkisi kanıtsız.
- **Önerinin katılmadığım tek yeri: lig tamamen reddedilmiş.** Duolingo'da lig, öğrenme süresinde +%17 sağlamıştı (önerideki Lenny kaynağı). Yabancılarla lig çocuk için yanlış, buna katılıyorum. Ama **koçun sınıfı içinde, küme düşmesi olmayan haftalık "en çok tehdit bulan"** listesi B2B satışta güçlü bir koz. Rekabet tanıdık kişilerle sınırlı kalır.

## 2. Pazar ve rakipler
| Oyuncu | Ne veriyor | Puhu'ya etkisi |
|---|---|---|
| ChessKid (Chess.com) | Çocuğa özel güvenli platform, ders, bulmaca, okul ve kulüp araçları (öğretmen paneli, gelişim takibi). İngiltere fiyatı £42/çocuk/yıl. Okul bölgelerine kişi başı yıllık $1,50'ye kadar inen fiyat (eski sayfa). 100+ çocukta Enterprise. | Çocuk segmentinin lideri. Türkçe arayüz ve çocuğun kendi oyunundan kişisel ders yok. Puhu fiyatla yarışamaz, **kişiselleştirme ve Türkçe** ile ayrışır. |
| Chess.com üyelikleri | Ücretsiz katmanda günde 1 ders, 3 bulmaca, 1 tam oyun incelemesi. Diamond'da her hamlede koç açıklaması ve Insights. Aile planı 6 kişi. | "Oyununu açıklayan koç" özelliği zaten var, ama yetişkine göre ve ücretli. Türkiye mağaza fiyatı kullanıcı raporlarına göre yılda 288-400 TL. |
| Lichess | Her şey ücretsiz: analiz, Learn from your mistakes, bulmaca, **Lichess Classes** (öğretmen için ücretsiz sınıf: öğrenci hesabı açma, oyun ve bulmaca ilerlemesini izleme, reklamsız). | Kulüp koçu için en büyük engel "Lichess Classes zaten bedava". Rakip olarak değil, **üstüne katman** olarak konumlanmalı: "Lichess sınıfındaki öğrencilerine, kendi oyunlarından otomatik ödev ve veli raporu." |
| TRT Çocuk Satranç | Ücretsiz, reklamsız, çocuk için oyun. | Satrancı ilk kez öğrenen çocuk segmentini kapatıyor. Puhu ~800 ve üstündeki kulüp çocuğunu hedeflemeli. |
| Türk kulüpleri, okullar, birebir dersler | Yabancı platformlarda Türkçe konuşan özel ders veren eğitmenlerin fiyatı ders başına yaklaşık 14 € ile $25 arası. Türkçe kayıtlı video kurs 750-999 TL. | Velinin halihazırda ödediği bütçe birebir ders ve kulüp aidatı. Puhu "dersin arasında koçun gözü" olarak satılmalı. |

**Pazar büyüklüğü sinyali:** TSF açıklamalarına göre lisanslı sporcu sayısı 2019'da 913 bin, daha yeni bir haberde "1 milyonun üzerinde". İş Bankası ile yürütülen Satranç Sınıfları projesiyle 16 bin+ okulda 3 milyon çocuk, 24 bin+ satranç sınıfı. Bu rakamlar toplam lisansı gösteriyor, aktif lisans değil. Kaynak kendisi de iki kavramın karıştırıldığını not ediyor. Hedef kitle "aktif turnuva oynayan ve Lichess veya Chess.com hesabı olan çocuk", bunun çok küçük bir alt kümesi.

## 3. Kim öder
1. **Veli (B2C), ilk gelir kaynağı.** Ödeme gerekçesi "çocuğum daha az hata yapıyor, bunu görüyorum". Bunu karşılayan şey haftalık veli raporu. Ekranda geçen süre değil.
2. **Kulüp ve koç (B2B2C), en hızlı dağıtım kanalı.** Koç başına 10-30 çocuk gelir, veli koçun önerisine güvenir. Satılacak ürün koç paneli: "öğrencilerinin bu haftaki kişisel zaafları ve otomatik ödev".
3. **Okul ve TSF, 12 ayı aşan bir hedef.** Kamu alımı, MEB onayı ve KVKK denetimi gerektiriyor, satış döngüsü uzun. 3 aylık MVP'de hedeflenmemeli. Pilot verisi elde olduğunda bir il temsilciliği ile görüşülebilir.

## 4. Fiyat (test edilecek hipotezler)
Dayanaklar: Duolingo Super Türkiye bireysel yıllık ~330 TL, aile ~500 TL (eski kampanya, OzBargain). Chess.com Diamond Türkiye mağazasında 288-400 TL/yıl (kullanıcı raporları). ChessKid £42/yıl. Türkiye mağaza fiyatları düşük. Puhu bunların üstüne çıkmak için koç ve rapor değerini öne koymalı.
- **Ücretsiz katman:** Kendi hatalarından günlük plan, seri, Puhu. Lichess bu özellikleri zaten ücretsiz verdiği için duvar arkasına konmamalı.
- **Aile paketi (hipotez): yılda 449-599 TL, 2-3 çocuk.** İçeriği: haftalık veli raporu, sınırsız tekrar destesi, cihazlar arası senkron, hatırlatma.
- **Kulüp koltuğu (hipotez): öğrenci başı ayda 20-30 TL**, koç paneli ücretsiz. Koç komisyonu ya da indirim kodu da düşünülebilir.
- **Doğrulama:** 3. ayda sahte kapı ("Aile paketine geç" düğmesi ve bekleme listesi) ile 2-3 kulüpte ön satış. Fiyatı tahmin etme, ölç.

## 5. Lichess API, isim ve lisans (ürünleşmeyi en çok bloke eden kısım)
- **GPL bulgusu, kritik.** Uygulama chessground@9.1.1 kullanıyor (index.html satır 10-12 ve 310). Chessground README'sine göre lisans GPL-3.0 ve "birleşik eseriniz yalnız GPL altında dağıtılabilir; kaynak kodunuzu sitenizin kullanıcılarına açmalısınız" (https://github.com/lichess-org/chessground, açıldı). Stockfish de GPL. Seçenekler ikisi:
  - (a) Ürün açık kaynak (GPL) kalır, gelir hizmetten gelir: senkron, rapor, koç paneli, backend. Backend kodu ayrı tutulursa kapalı kalabilir, bu hukukçuya teyit ettirilmeli.
  - (b) Chessground yerine MIT lisanslı bir tahta kütüphanesi kullanılır.
  
  Benim önerim (a). Hizmet modeli zaten backend'e dayanıyor. Ayrıca cburnett taş setinin lisansı (CC BY-SA) da kontrol edilmeli. Proje kökünde bir LICENSE dosyası olup olmadığını doğrulamadım.
- **API kuralları** (resmi OpenAPI spec'inden, https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/lichess-api.yaml, açıldı):
  - "Only make one request at a time". 429 alınırsa yaklaşık 1 dakika beklenmeli.
  - PKCE ile kayıtsız, public client destekleniyor. Token yaklaşık 1 yıl geçerli, refresh token yok.
  
  **Ürün sonucu:** Oyun çekme işi istemcide, kullanıcının kendi token'ıyla kalmalı. Backend tek IP'den binlerce kullanıcının oyununu çekmeye kalkarsa rate limit'e takılır. Backend yalnız ilerleme verisini tutmalı.
- **Ticari kullanım:** Arama özetine göre Lichess koşulları siteyi "kişisel ve ticari kullanım" için lisanslara uymak şartıyla serbest bırakıyor. Take Take Take duyurusunda ise "Lichess'i kullanan her oyun alanı her zaman ücretsiz kalmalı" deniyor (https://lichess.org/@/Lichess/blog/lichess-and-take-take-take-sign-cooperation-agreement/DZS0S0Dy, arama özeti, sayfa 403 verdi). Puhu oyun barındırmıyor, eğitim katmanı satıyor. Buna rağmen ücretli lansmandan önce contact@lichess.org'a yazılı olarak sorulmalı.
- **İsim:** "Lichess" adı ürün adında, logoda ya da alan adında kullanılmamalı. Yalnız tanımlayıcı kullanım uygun: "Lichess hesabınla çalışır", "Lichess ile bağlantılı değildir". İsim kullanımını açıkça düzenleyen bir Lichess politikası bulamadım.
- **Tek platform riski:** Çocukların büyük kısmı Chess.com veya ChessKid'de oynuyor olabilir. Chess.com'un herkese açık oyun API'si olduğunu biliyorum ama bu oturumda doğrulamadım. Bunun eklenmesi pazar büyüklüğünü katlar, MVP sonrasına konmalı.

## 6. Maskot benzerliği riski
- **Kaynakların gösterdiği:** Duolingo'nun ABD'de görsel markaları ve peluş oyuncak tescil başvuruları var (https://trademark.justia.com/owners/duolingo-inc-2782485, arama özeti). Baykuş için açılmış bir dava bulamadım. Bir hayran çizimi kaldırma vakası var, ama o Lily karakteriyle ilgiliydi.
- **Benim değerlendirmem:** Baykuş kavramı ve Türkçede bir kuş türünün adı olan "puhu" tek başına sorun değil. Risk görsel ve davranışsal benzerlikte (trade dress).
- **Kurallar:**
  - Duolingo yeşili kullanılmamalı. Puhu kahve ve turuncu olmalı, kulak tüyleri belirgin çizilmeli (puhu türünün ayırt edici özelliği).
  - Yuvarlak yeşil gövde, ateş simgeli seri ikonu ve "Duo"yu çağrıştıran suçluluk mizahı kullanılmamalı.
  - Reklamda "satrancın Duolingo'su" ifadesi kullanılmamalı (başkasının markasıyla karşılaştırmalı tanıtım riski).
  - Lansmandan önce TÜRKPATENT'te "Puhu" ve "Puhu Koç" için 9, 41 ve 42. sınıflarda arama yapılıp tescil başvurusu verilmeli. Bu aramayı ben yapmadım.

## 7. 3 aylık MVP
**İlke:** Mevcut tek dosyalı uygulama korunur, yanına en küçük backend eklenir. Oyun verisi sunucuya gitmez.

**1. ay: temel ve veri**
- Seri ve dondurma düzeltmesi (önerinin 1-2. maddeleri), `events` günlüğü, sağlıklı durak (15).
- **Senkron backend:** Kimlik Lichess OAuth'tan gelir. Kullanıcı başına tek bir JSON ilerleme kaydı tutulur (Leitner kutuları, seri, yıldız). Anahtar Lichess kullanıcı kimliğinin hash'i olur. Bir sunucusuz KV ya da SQL servisi yeterli. Oyun içeriği ve kullanıcı adı loglanmaz.
- **Veli hesabı:** Yalnız e-posta ve onay kaydı (KVKK aydınlatma metni, açık rıza, Lichess 16 yaş onayı).

**2. ay: tetik ve ödeyen kişi**
- **Haftalık veli raporu, e-posta ile.** Veli paneli yazmaktan ucuz ve velinin zaten baktığı kanal orası. İçeriği: blunder eğilimi, aktif gün sayısı, "bu hafta öğrendiği motif". WhatsApp'a paylaşılabilir bir kart eklenir.
- **PWA ve Web Push:**
  - iOS'ta push yalnız Ana Ekran'a eklenmiş web uygulamasında, kullanıcı bir düğmeye bastıktan sonra istenebiliyor. Push API, Notifications API ve Service Worker kullanılıyor, Apple geliştirici hesabı gerekmiyor (https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/, açıldı).
  - Gönderim için sunucuda VAPID anahtarı ve zamanlanmış görev gerekir.
  - Onboarding'e "Ana ekrana ekle" adımı konmalı. Çocuğun telefonu yoksa push veliye gider.
- **Koç görünümü (lite):** Koç bir davet kodu paylaşır. Öğrencilerin listesini, en sık 3 zaafını ve aktif günlerini görür. Lichess Classes'ın tamamlayıcısıdır.

**3. ay: pilot**
- 2-3 kulüpten 20-50 çocuk.
- Ödeme sahte kapısı. Gerçek ödeme gerekirse yerli sanal POS ile web üzerinden alınır, uygulama mağazası komisyonu ve çocuk kategorisi kuralları ertelenir.
- Ölçümler: D1, D7, D30, haftalık aktif gün, push ile açılma oranı, veli raporu açılma oranı, koç başına aktif öğrenci.

**Hukuk (hukukçu teyidi şart):**
- Arama sonuçlarına göre KVKK'da çocuk verisi ve yaş sınırı için özel bir düzenleme yok (DergiPark makalesi, güncelliğini doğrulamadım). Bu yüzden velinin açık rızası ve veri minimizasyonu esas alınmalı.
- Bulut sunucusu yurt dışındaysa yurt dışı aktarım hükümleri devreye girer.
- VERBİS yükümlülüğü kontrol edilmeli.

**MVP'ye girmeyenler:** Ustalık haritası (8), takım (13), sürpriz soru (9), tehdit dedektörünün tam motoru (4). Kanıt gelince eklenir.

## 8. Tutmayı gerçekten etkileyen mekanikler (kanıta göre sıralı)
1. **Tek ve iyi zamanlanmış hatırlatma.** Duolingo'nun ilk büyük seri kazancı hatırlatmadan geldi, "kanalı koru" kuralıyla birlikte (önerideki Lenny kaynağı). Puhu'da şu an tetik hiç yok, bu yüzden en büyük kaldıraç bu. Çocuk için saat 20:00 sınırı korunmalı.
2. **Kolay seri tanımı ve dondurma.** Duolingo'da D14 tutmada +%3,3 ve DAU'da +%0,38 sağladı (önerinin kaynakları). Maliyeti birkaç satır kod.
3. **Kendi oyunundan yeni içerik bildirimi** ("Dünkü maçından 2 ders"). Hem değişken ödül hem yatırım. Puhu'ya özgü, rakiplerde yok. Kanıtı henüz bir hipotez, pilotta ölçülmeli.
4. **Hesap verebilirlik: veli raporu ve koç ödevi.** Satranç kulübündeki çocuk koçuna karşı sorumlu hisseder. Bunu tutmaya bağlayan bir kaynak açmadım. Hipotez, ama B2B satışın temeli.
5. **Etkisi düşük olanlar:** Sınırsız XP sayacı (Duolingo'nun ilk denediği gamification tutmaya hiç etki etmedi), kozmetik rozetler, ganimet kutusu. Yıldız ve rütbe kalabilir ama kaldıraç değil.

**Pilot başarı ölçütü (hipotez, şimdiden yaz):** 8 haftada çocukların çoğunluğu haftada 3+ aktif gün, velilerin yarısından fazlası raporu açıyor, en az bir koç ikinci grubunu ekliyor. Bu ölçüt tutmazsa ödeme kurgusundan önce tetik ve içerik düzeltilmeli.

## Kaynaklar
**Açılıp okunanlar:**
- https://raw.githubusercontent.com/lichess-org/api/master/doc/specs/lichess-api.yaml (rate limit, OAuth PKCE)
- https://github.com/lichess-org/chessground (GPL-3.0)
- https://github.com/lichess-org/api (AGPL, dokümanların yeri)
- https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- https://support.chess.com/en/articles/8562418-what-does-each-level-of-membership-get-me
- https://www.chesskid.com/learn/articles/chesskid-for-school-districts

**Yalnız arama özetiyle görülenler (lichess.org sayfaları 403 verdi):**
- https://lichess.org/terms-of-service ve 16 yaş alıntısı: https://lichess.org/forum/off-topic-discussion/what-is-the-age-limit-for-kid-mode-and-is-there-a-age-limit-for-posting-forums
- https://lichess.org/@/Lichess/blog/lichess-and-take-take-take-sign-cooperation-agreement/DZS0S0Dy
- https://lichess.org/class
- https://lichess.org/blog/WFvLpiQAACMA8e9D/learn-from-your-mistakes
- https://lichess.org/forum/lichess-feedback/create-learn-from-your-mistakes-across-all-games
- https://chess.co.uk/pages/chesskid (ChessKid £42/yıl)
- https://www.chesskid.com/article/view/chesskid-for-school-districts ($1,50/çocuk, eski)
- https://support.chesskid.com/en/articles/8863340-coach-school-i-want-to-sign-up-10-accounts-for-my-club-or-school-do-you-offer-a-discount
- https://www.ozbargain.com.au/node/823389 (Duolingo Super TL)
- https://www.chess.com/forum/view/general/diamond-membership-yearly ve https://www.mydealz.de/deals/chesscom-diamant-jahresmitgliedschaft-via-vpn-turkei-2007eur-2136146 (Diamond TL)
- https://www.trthaber.com/haber/spor/satrancta-hedef-1-milyon-lisansli-sporcu-440324.html, https://www.hurriyet.com.tr/egitim/satranc-okul-tercihinde-etkili-oluyor-41347851, https://shgm.gsb.gov.tr/Public/images/SGM/Federasyon/17285TSF 2016 - 2021 Dönemi Yönetim Kurulu Faaliyet Raporu.pdf (TSF rakamları)
- https://www.trthaber.com/trtden-haberler/trtden-cocuklar-icin-yeni-bir-oyun-daha-trt-cocuk-satranc-1282.html
- https://www.apprentus.com/en/private-lessons/leuven/other/chess/private-chess-from-chess-coach-referee-one, https://preply.com/tr/öğretmen/8153778, https://boenstitu.com/online-egitimler/temel-satranc-kursu (ders fiyatları)
- https://trademark.justia.com/owners/duolingo-inc-2782485, https://www.lawcommentary.com/articles/duolingo-lily-fan-art-legal-removal
- https://dergipark.org.tr/en/pub/kvkd/article/826099, https://www.kvkk.gov.tr/Icerik/2030/rehberler?page=4 (KVKK ve çocuk verisi)

**İncelenen kod:** f:/lichess/index.html. Satır 10-12 ve 310 (chessground), 606-638 (rütbe, yıldız, seri, plan), 762-771 ve 979-1218 (Lichess API çağrıları), 789-819 (istemcide Stockfish).