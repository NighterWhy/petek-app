# Petek 🍯

Petek, üniversite öğrencileri arasında ikinci el eşya paylaşımını ve takasını kolaylaştıran, temeline sosyal dayanışmayı alan bir platformdur. Kolektif çalışmayı ve topluluk bilincini simgeleyen bu proje, ölçeklenebilir modern yazılım mimarileri ile geliştirilmektedir.

## Mimari & Teknolojiler
* **Mimari:** Microservices
* **Backend:** NestJS
* **Altyapı & Dağıtım:** Docker

## 🚀 Projeyi Docker ile Çalıştırma (Test & Geliştirme)

Projeyi kendi bilgisayarınızda hiçbir ek kurulum (Node.js, MySQL vb.) yapmadan test etmek için Docker kullanabilirsiniz.

### Ön Koşullar
- Bilgisayarınızda [Docker Desktop](https://www.docker.com/products/docker-desktop) kurulu ve çalışıyor olmalıdır.

### Kurulum Adımları

**1. Depoyu Klonlayın ve Klasöre Girin:**
```bash
git clone [https://github.com/NighterWhy/petek-app.git](https://github.com/NighterWhy/petek-app.git)
cd petek-app/petek-backend
```
*(Not: docker-compose.yml dosyanız neredeyse o dizine geçiş yapın.)*

**2. Çevre Değişkenleri (.env) Ayarlaması - DİKKAT:**
Güvenlik sebebiyle veritabanı şifreleri ve ortam değişkenlerini barındıran .env dosyası bu depoda bulunmamaktadır. **Projeyi ayağa kaldırmadan önce gerekli şifreler ve .env dosyası için benimle özelden iletişime geçin.** Aldığınız .env dosyasını petek-backend klasörünün içine yerleştirin.

**3. Sistemi Başlatın:**
Terminali docker-compose.yml dosyasının bulunduğu dizinde açarak aşağıdaki komutu çalıştırın:
```bash
docker-compose up --build
```
*(Konteynerlerin terminali meşgul etmeden arka planda çalışmasını isterseniz docker-compose up -d --build kullanabilirsiniz.)*

**4. Projeyi Test Edin:**
Kurulum başarıyla tamamlandığında servisler ayağa kalkacaktır. Tarayıcı veya Postman üzerinden API'ye istek atarak testlerinizi gerçekleştirebilirsiniz:
- **API Adresi:** http://localhost:3000 *(Port ayarına göre değişebilir)*

**5. Sistemi Durdurma:**
Testiniz bittiğinde konteynerleri durdurmak ve temizlemek için şu komutu kullanın:
```bash
docker-compose down
```
