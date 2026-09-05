const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());

app.get('/api/convert', (req, res) => {
    const { url, format } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Falta la URL del video' });
    }

    // Usamos pasarelas de extracción directa de alta velocidad optimizadas para móviles
    const targetUrl = format === 'mp3'
        ? `https://p.oceansaver.in/ajax/download.php?copyright=0&url=${encodeURIComponent(url)}&f=mp3`
        : `https://p.oceansaver.in/ajax/download.php?copyright=0&url=${encodeURIComponent(url)}&f=mp4`;

    // Respondemos con un JSON limpio que contiene la ruta de descarga directa
    res.json({
        success: true,
        downloadUrl: targetUrl
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend activo en el puerto ${PORT}`);
});
