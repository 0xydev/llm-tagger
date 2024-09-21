
# LLM Tagger

Bu proje, kullanıcıdan başlık ve açıklama bilgilerini alarak ilgili yazılım geliştirme projeleri için etiketler öneren bir arayüz sağlar. Etiket önerileri için **Ollama** API'sini kullanır. Ayrıca, önceden tanımlanmış etiketlerin kullanılıp kullanılmayacağını belirleyen bir switch bulunmaktadır. Tamamen deneysel olarak hazırlanmıştır.

## Proje Özellikleri

- **Başlık ve Açıklama Alanları**: Kullanıcı, yazılım projesiyle ilgili başlık ve açıklama bilgisini girebilir.
- **Etiket Önerileri**: Ollama API üzerinden başlık ve açıklamaya dayalı olarak tek kelimelik etiket önerileri alabilirsiniz.
- **Önceden Tanımlanmış Etiketler**: Uygulama, önceden belirlenmiş etiketleri gösterir ve bu etiketlerin önerilere dahil edilip edilmeyeceğini belirlemek için bir switch içerir.
- **Etiket Seçimi**: Kullanıcı, önerilen etiketlerden dilediğini seçip formda kullanabilir.
- **Seçilen Etiketler**: Kullanıcı seçtiği etiketleri formda görebilir ve formu bu etiketlerle birlikte gönderebilir.

## Kurulum

### 1. Gerekli Bağımlılıkların Yüklenmesi

Öncelikle, bu projeyi çalıştırabilmek için bilgisayarınızda [Node.js](https://nodejs.org/en) yüklü olmalıdır. Node.js'i kurduktan sonra projeyi aşağıdaki adımları takip ederek başlatabilirsiniz:

1. Bu projeyi klonlayın:
    ```bash
    git clone https://github.com/0xydev/llm-tagger.git
    cd llm-tagger
    ```

2. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

### 2. Ollama API Anahtarı Alınması

Bu proje, **Ollama API** üzerinden çalışmaktadır. Bu yüzden Ollama'nın sisteminizde kurulu olduğundan emin olun. Mevcut olarak büyük dil modeli llama3.1 seçilmiştir.

[Ollama](https://ollama.ai/) üzerinden indirebilirsiniz.


### 3. Dil Modeli İndirme ve API Sunucusunu Başlatma

İndirdiğiniz Ollama uygulamasını açın. Sunucuyu çalıştırmak için aşağıdaki adımları izleyin:

1. Dil modelini indirme:
    ```bash
    ollama run llama3.1
    ```

İndirme tamamlandıktan sonra uygulamayı kapatmayın. Modelin çalıştığı terminali kapatabilirsiniz. Arkaplanda çalıştığına emin olmak için aşağıdaki porta bakabilirsiniz.:
    ```bash
        http://localhost:11434/
    ```

### 4. React Uygulamasını Çalıştırma

Proje kurulumundan sonra React uygulamasını başlatmak için şu komutu kullanın:

```bash
npm run dev
```

Bu komut, projeyi varsayılan olarak `http://localhost:5173` adresinde başlatır. Tarayıcınızda bu adrese giderek uygulamayı görebilirsiniz.


## Proje Yapısı

```
/src
  ├── /components
  │   ├── TagForm.js           # Form bileşeni, başlık ve açıklama girişi sağlar
  │   ├── PredefinedTagList.js # Önceden tanımlanmış taglerin listesini gösterir
  │   ├── TagList.js           # Önerilen tagleri liste halinde gösterir
  │   ├── SelectedTags.js      # Seçilen taglerin listesini gösterir
  ├── /data
  │   └── predefinedTags.js    # Önceden tanımlanmış tagleri barındıran veri dosyası
  ├── App.js                   # Ana uygulama bileşeni
  └── index.js                 # Uygulamanın başlangıç dosyası
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
