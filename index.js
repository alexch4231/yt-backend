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
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");

        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            res.header('Content-Type', 'audio/mpeg');
            ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            res.header('Content-Type', 'video/mp4');
            ytdl(videoUrl, { quality: 'highestvideo' }).pipe(res);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al procesar el video');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));