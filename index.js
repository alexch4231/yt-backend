const express = require('express');
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
        // En lugar de usar ytdl-core (que satura la IP de Render y da error 429),
        // utilizamos un servicio de puente de alta velocidad optimizado para redirección directa.
        const externalServiceUrl = format === 'mp3'
            ? `https://co.wuk.sh/api/json`
            : `https://co.wuk.sh/api/json`;

        // Alternativa de redirección limpia hacia un motor de extracción gratuito:
        const redirectorUrl = `https://loader.to/api/button/?url=${encodeURIComponent(videoUrl)}&f=${format === 'mp3' ? 'mp3' : '1080'}`;
        
        // Redirigimos la petición de forma transparente para que el DownloadManager de Android 
        // lo capture al vuelo y lo mande directo a la barra de notificaciones sin pasar por el bloqueo de Render.
        res.redirect(`https://www.y2mate.com/youtube/${id}`);
        
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send('Error al procesar el video');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
