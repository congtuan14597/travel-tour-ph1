const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
const sharp = require('sharp');
const path = require('path');
const archiver = require('archiver');

const remove_background = async (req, res) => {
    try {
        const processedImages = [];
        const outputDir = path.join(__dirname, 'output');
        const zipFilePath = path.join(__dirname, 'output.zip');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        for (const file of req.files) {
            const filePath = file.path;
            const originalFileName = file.originalname;
            const imageData = fs.readFileSync(filePath);

            const resultURL = await processImageWithAPIs(imageData, file.mimetype);

            if (resultURL) {
                const base64Data = resultURL.split(';base64,').pop();
                const imageBuffer = Buffer.from(base64Data, 'base64');

                const processedImageBuffer = await processImageFurther(imageBuffer);

                const outputFileName = path.basename(originalFileName, path.extname(originalFileName)) + '-processed.png';
                const outputPath = path.join(outputDir, outputFileName);

                await saveImageAsync(processedImageBuffer, outputPath); // Use await here
                processedImages.push(outputPath);
            } else {
                processedImages.push(null);
            }

            fs.unlink(filePath, (err) => {
                if (err) console.error('Failed to delete file:', err);
            });
        }

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 } 
        });

        output.on('close', function() {
            console.log(`${archive.pointer()} total bytes`);
            console.log('Zip file has been finalized and the output file descriptor has been closed.');

            res.json({ zipFilePath: '/output.zip' }); 
        });

        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output);
        archive.directory(outputDir, false);
        archive.finalize();

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
