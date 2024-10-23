# Node.js PDF Extraction Project

Proyek ini adalah sebuah aplikasi Node.js sederhana yang menggunakan `express`, `multer`, `pdf-parse`, dan `pdfkit` untuk mengekstrak data dari file PDF dan menghasilkan file PDF baru berdasarkan hasil ekstraksi tersebut. Proyek ini menggunakan `nodemon` untuk mempermudah proses pengembangan dengan melakukan restart otomatis setiap kali ada perubahan pada kode.

## Fitur Utama

- Upload file PDF melalui form.
- Ekstraksi data tertentu dari file PDF yang diunggah.
- Hasil ekstraksi ditampilkan dalam format file PDF yang bisa diunduh.

## Prasyarat

Pastikan Anda memiliki perangkat lunak berikut yang terinstal di komputer Anda:

- [Node.js](https://nodejs.org/en/) (versi LTS disarankan)
- [npm](https://www.npmjs.com/get-npm) (biasanya sudah termasuk saat menginstal Node.js)

## Instalasi

Ikuti langkah-langkah berikut untuk men-setup proyek ini di lokal Anda:

1. Clone repository ini ke komputer Anda:
   ```bash
   git clone <URL_REPOSITORY>
   ```

2. Masuk ke direktori proyek:
   ```bash
   cd <nama_folder_proyek>
   ```

3. Install dependensi proyek:
   ```bash
   npm install
   ```

4. Jika Anda belum menginstal `nodemon` secara global, Anda bisa menginstalnya sekarang:
   ```bash
   npm install -g nodemon
   ```

   Atau Anda bisa menginstalnya hanya di proyek ini:
   ```bash
   npm install --save-dev nodemon
   ```

## Cara Menjalankan

Setelah setup selesai, Anda dapat menjalankan aplikasi dengan cara berikut:

1. Jalankan server menggunakan `nodemon`:
   ```bash
   nodemon index.js
   ```

   Atau, jika Anda sudah menambahkan skrip untuk menjalankan `nodemon` di `package.json`, Anda bisa menjalankan:
   ```bash
   npm run dev
   ```

2. Server akan berjalan di `http://localhost:3000`. Anda bisa mengaksesnya dari browser atau menggunakan API client seperti Postman untuk mengunggah file PDF.

## Penggunaan

1. **Upload PDF**: Buka aplikasi di browser di `http://localhost:3000` dan unggah file PDF yang ingin Anda ekstrak.
2. **Ekstraksi Data**: Aplikasi akan memproses file PDF yang diunggah dan mengekstrak data tertentu dari dokumen tersebut.
3. **Download Hasil**: Setelah ekstraksi selesai, Anda akan mendapatkan link untuk mengunduh file PDF hasil yang berisi data yang telah diekstrak.

## Struktur Proyek

```bash
.
├── node_modules        # Folder dependensi
├── uploads             # Folder sementara untuk file yang diupload
├── output              # Folder tempat hasil file PDF disimpan
├── index.js            # File utama untuk menjalankan server
├── package.json        # File konfigurasi proyek dan dependensi
└── README.md           # File ini
```

## Dependensi Utama

- **express**: Framework untuk membuat server web.
- **multer**: Middleware untuk menangani upload file.
- **pdf-parse**: Library untuk mengekstrak teks dari file PDF.
- **pdfkit**: Library untuk membuat file PDF.
- **nodemon**: Alat untuk melakukan restart server secara otomatis saat ada perubahan kode.

## Skrip `package.json`

Anda bisa menambahkan skrip berikut ke dalam `package.json` agar lebih mudah menjalankan proyek:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

Dengan skrip ini, Anda bisa menjalankan:

- `npm start`: Untuk menjalankan aplikasi secara manual menggunakan `node`.
- `npm run dev`: Untuk menjalankan aplikasi dengan `nodemon` agar otomatis restart saat ada perubahan kode.
