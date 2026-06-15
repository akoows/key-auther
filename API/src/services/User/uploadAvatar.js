export function uploadAvatar() {
    try {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'avatars', resource_type: 'image' },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                user.avatarUrl = result.secure_url;
                res.json({ 
                    msg: 'Avatar enviado com sucesso', 
                    url: result.secure_url 
                });
            }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(uploadStream);

    } catch (error) {
        throw new Error("Falha ao fazer o upload da imagem!\n\nErro: " + error)
    }
}