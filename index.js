const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/download', async (req, res) => {
    const { id, format } = req.query;

    if (!id) {
        return res.status(400).send('Falta el ID del video');
    }

    const videoUrl = `https://www.youtube.com/watch?v=${id}`;

    try {
        // Configuramos opciones para forzar el cliente movil de YouTube y evitar el bloqueo 429 de Render
        const options = {
            quality: format === 'mp3' ? 'highestaudio' : 'highestvideo',
            filter: format === 'mp3' ? 'audioonly' : 'videoandaudio',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                    'X-YouTube-Client-Name': '1',
                    'X-YouTube-Client-Version': '2.20231201.00.00'
                }
            }
        };

        const info = await ytdl.getInfo(videoUrl, options);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");

        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            res.header('Content-Type', 'audio/mpeg');
            ytdl(videoUrl, options).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            res.header('Content-Type', 'video/mp4');
            ytdl(videoUrl, options).pipe(res);
        }
    } catch (err) {
        console.error("Error detallado:", err.message);
        res.status(500).send('Error al procesar el video: ' + err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
