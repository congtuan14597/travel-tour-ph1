const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
const sharp = require('sharp');
const path = require('path');
const archiver = require('archiver');

const remove_background = async (req, res) => {
    try {
        const processedImages = [];

        for (const file of req.files) {
            const filePath = file.path;
            const imageData = fs.readFileSync(filePath);

            const resultURL = await processImageWithAPIs(imageData, file.mimetype);

            if (resultURL) {
                const base64Data = resultURL.split(';base64,').pop();
                const imageBuffer = Buffer.from(base64Data, 'base64');

                const processedImageBuffer = await processImageFurther(imageBuffer);

                const finalImageURL = `data:image/png;base64,${processedImageBuffer.toString('base64')}`;
                processedImages.push(finalImageURL);
            } else {
                processedImages.push(null);
            }

            // Delete the uploaded file after processing
            fs.unlink(filePath, (err) => {
                if (err) console.error('Failed to delete file:', err);
            });
        }

        if (processedImages.length) {
            res.send(processedImages); // Return an array of processed image URLs
        } else {
            res.status(500).send('Failed to process images.');
        }

    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).send('Error processing images.');
    }
};


const saveImageAsync = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, buffer, (err) => {
            if (err) {
                console.error('Failed to save image:', err);
                reject(err);
            } else {
                console.log(`Image saved as ${filename}`);
                resolve();
            }
        });
    });
};

async function processImageWithAPIs(imageData, mimeType) {
    for (const api of apis) {
        try {
            const formData = new FormData();
            formData.append('image_file', imageData, {
                contentType: mimeType,
                filename: 'image.png',
            });

            const response = await fetch(api.url, {
                method: 'POST',
                headers: {
                    'X-API-Key': api.key,
                },
                body: formData,
            });

            if (response.ok) {
                const resultBlob = await response.buffer();
                const upscaledImageURL = `data:${mimeType};base64,${resultBlob.toString('base64')}`;
                return upscaledImageURL;
            }
        } catch (error) {
            console.error(`Error processing image with ${api.name}:`, error);
        }
    }
    console.error('Failed to process image using any API.');
    return null;
}

async function processImageFurther(imageBuffer) {
    // Replace the background with white and resize to 4x6 inches
    const processedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 600, height: 900 }) // 4x6 inches in pixels (assuming 150 DPI)
        .flatten({ background: { r: 255, g: 255, b: 255 } }) // Replace background with white
        .toBuffer();

    return processedImageBuffer;
}

const apis = [
    { name: 'clipdrop.co', url: 'https://clipdrop-api.co/remove-background/v1', key: process.env.KEY_RLIPDROP },
    { name: 'slazzer.com', url: 'https://api.slazzer.com/v2.0/remove_image_background', key: process.env.KEY_LAZZER },
    { name: 'remove.bg', url: 'https://api.remove.bg/v1.0/removebg', key: process.env.KEY_REMOVE },
    { name: 'removal.ai', url: 'https://api.removal.ai/3.0/remove', key: process.env.KEY_REMOVAL },
    { name: 'photoroom.com', url: 'https://sdk.photoroom.com/v1/segment', key: process.env.KEY_PHOTOROOM },
];

let getViewRemoveBg = async (req, res) => {
    res.render("admin/remove_background/remove_bg");
};

module.exports = {
    getViewRemoveBg,
    remove_background,
};
