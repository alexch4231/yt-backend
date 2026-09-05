const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());

app.get('/download', (req, res) => {
    const { id, format } = req.query;

    if (!id) {
        return res.status(400).send('Falta el ID del video');
    }

    const videoUrl = `https://www.youtube.com/watch?v=${id}`;

    // Usamos ytdl-core alternativo o redireccionamos a una ruta de extracción directa
    // Una opción rápida y robusta en Node sin lidiar con el 429 de IPs de Render es extraer el enlace directo mediante ytpl/yt-dlp o usar un redirector limpio:
    const targetUrl = format === 'mp3' 
        ? `https://p.oceansaver.in/ajax/download.php?copyright=0&url=${encodeURIComponent(videoUrl)}&f=mp3`
        : `https://p.oceansaver.in/ajax/download.php?copyright=0&url=${encodeURIComponent(videoUrl)}&f=mp4`;

    // Redirigimos la petición de manera transparente para que el DownloadManager de Android lo capture al vuelo sin pasar por el bloqueo de IP de Render
    res.redirect(targetUrl);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
