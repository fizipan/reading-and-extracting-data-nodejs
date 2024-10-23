const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');  // Untuk membuat nama file acak

const app = express();

// Pastikan direktori 'uploads' ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);  // Buat direktori 'uploads' jika belum ada
}

const upload = multer({ dest: uploadDir });  // Multer akan menyimpan file di direktori 'uploads'

app.use(express.static('public'));

// Fungsi untuk mengekstrak data yang sesuai dengan pola
function extractData(text) {
    const extractedData = {};

    // Ekstraksi H1: Angka besar yang mungkin berada dalam kotak
    extractedData.H1 = text.match(/\d{10}/) ? text.match(/\d{10}/)[0] : 'Tidak ditemukan';

    // Ekstraksi H2: Jika ada data yang sesuai
    extractedData.H2 = 'X'; // Jika ada data H2 yang bisa diidentifikasi, bisa diupdate di sini

    // Ekstraksi A1: NPWP (biasanya 15 digit)
    const npwpMatch = text.match(/\d{15}/);
    extractedData.A1 = npwpMatch ? npwpMatch[0] : 'Tidak ditemukan';

    // Ekstraksi A3: Nama Wajib Pajak (biasanya diikuti oleh kata "Nama")
    const nameMatch = text.match(/Nama\s*([^\n]+)/);
    extractedData.A3 = nameMatch ? nameMatch[1].trim() : 'Tidak ditemukan';

    // Ekstraksi B1: Masa Pajak (bentuk: 1-2023, atau format lain)
    const masaPajakMatch = text.match(/\d{1,2}-\d{4}/);
    extractedData.B1 = masaPajakMatch ? masaPajakMatch[0] : 'Tidak ditemukan';

    // Ekstraksi B12: Informasi terkait PPh yang dipotong
    const b12Match = text.match(/PPh yang dipotong\/dipungut yang diberikan fasilitas PPh berdasarkan:/);
    extractedData.B12 = b12Match ? b12Match[0] : 'Tidak ditemukan';

    // Ekstraksi C1: NPWP Pemotong (biasanya juga 15 digit)
    const npwpPemotongMatch = text.match(/:NPWP\s*(\d{15})/);
    extractedData.C1 = npwpPemotongMatch ? npwpPemotongMatch[1] : 'Tidak ditemukan';

    // Ekstraksi C5: Pernyataan Wajib Pajak (biasanya mengikuti kata "Pernyataan Wajib Pajak")
    const c5Match = text.match(/Pernyataan Wajib Pajak/);
    extractedData.C5 = c5Match ? c5Match[0] : 'Tidak ditemukan';

    return extractedData;
}

// Rute untuk mengunggah dan menghasilkan PDF
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Periksa apakah file diunggah dengan benar
        const filePath = req.file.path;
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ message: 'File tidak ditemukan!' });
        }

        // Baca dan ekstrak teks dari PDF yang diunggah
        const fileBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(fileBuffer);
        const extractedText = data.text;

        // Ekstraksi data dari teks
        const extractedData = extractData(extractedText);

        // Pastikan direktori 'output' ada
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            console.log("Direktori output tidak ada, membuat direktori...");
            fs.mkdirSync(outputDir);  // Buat direktori 'output' jika belum ada
        }

        // Buat nama file acak untuk PDF
        const randomFilename = `${uuidv4()}.pdf`;
        const outputPath = path.join(outputDir, randomFilename);

        console.log("Menulis file PDF di:", outputPath);

        // Buat PDF baru dengan data yang diekstrak
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Menulis data ke PDF
        doc.fontSize(12).text(`H1: ${extractedData.H1}`, 100, 100);
        doc.text(`H2: ${extractedData.H2}`);
        doc.text(`A1: ${extractedData.A1}`);
        doc.text(`A3: ${extractedData.A3}`);
        doc.text(`B1: ${extractedData.B1}`);
        doc.text(`B12: ${extractedData.B12}`);
        doc.text(`C1: ${extractedData.C1}`);
        doc.text(`C5: ${extractedData.C5}`);
        doc.end();

        // Tunggu sampai file PDF selesai ditulis
        stream.on('finish', function () {
            console.log("File PDF berhasil dibuat:", outputPath);
            // Kembalikan file PDF yang dihasilkan
            res.download(outputPath, randomFilename, (err) => {
                if (err) {
                    console.error('Error saat mengunduh file:', err);
                    return res.status(500).json({ message: 'Error saat mengunduh file' });
                }
            });
        });

        stream.on('error', function (err) {
            console.error('Error saat menulis file PDF:', err);
            return res.status(500).json({ message: 'Error saat menulis file PDF' });
        });

    } catch (error) {
        console.error('Error saat memproses PDF:', error);
        res.status(500).json({ message: 'Error saat memproses PDF', error: error.message });
    }
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
});

