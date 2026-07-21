const fs = require('fs');
const path = require('path');

const MEDIA_DIR = path.join(__dirname, '../../public/uploads/media');

// mime type → file extension
const MIME_EXT = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/3gpp': '3gp',
    'audio/ogg': 'ogg',
    'audio/ogg; codecs=opus': 'ogg',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3',
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'image/sticker': 'webp',
};

function extFromMime(mime) {
    if (!mime) return 'bin';
    const clean = (mime || '').split(';')[0].trim().toLowerCase();
    return MIME_EXT[clean] || mime.split('/')[1]?.split(';')[0]?.trim() || 'bin';
}

function mediaTypeFromMime(mime) {
    if (!mime) return 'document';
    const clean = (mime || '').split(';')[0].trim().toLowerCase();
    if (clean.startsWith('image')) return 'image';
    if (clean.startsWith('video')) return 'video';
    if (clean.startsWith('audio')) return 'audio';
    return 'document';
}

/**
 * Download a whatsapp-web.js Message's media and save to disk.
 * Returns { hasMedia, mediaType, mediaUrl, mimeType, caption, fileName }
 */
async function downloadAndSaveMedia(msg, userId) {
    if (!msg.hasMedia) {
        return { hasMedia: false, mediaType: null, mediaUrl: null, mimeType: null, caption: null, fileName: null };
    }

    try {
        const media = await msg.downloadMedia();
        if (!media || !media.data) {
            return { hasMedia: true, mediaType: mediaTypeFromMime(null), mediaUrl: null, mimeType: null, caption: msg.body || null, fileName: null };
        }

        const mime = media.mimetype || '';
        const ext = extFromMime(mime);
        const msgType = mediaTypeFromMime(mime);
        const fname = media.filename || `${msg.id.id}.${ext}`;
        const userDir = path.join(MEDIA_DIR, userId);

        // Ensure per-user directory exists
        if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

        const filePath = path.join(userDir, fname);
        const publicPath = `/uploads/media/${userId}/${fname}`;

        // Write base64 data to file
        const buffer = Buffer.from(media.data, 'base64');
        fs.writeFileSync(filePath, buffer);

        return {
            hasMedia: true,
            mediaType: msgType,
            mediaUrl: publicPath,
            mimeType: mime,
            caption: media.caption || msg.body || null,
            fileName: fname,
        };
    } catch (err) {
        console.warn(`[Media] Failed to download media for ${msg.id?.id}:`, err.message);
        return { hasMedia: true, mediaType: 'document', mediaUrl: null, mimeType: null, caption: msg.body || null, fileName: null };
    }
}

module.exports = { downloadAndSaveMedia, mediaTypeFromMime, extFromMime };
