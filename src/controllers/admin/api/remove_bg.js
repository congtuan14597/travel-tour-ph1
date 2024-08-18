const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const sharp = require('sharp');
const mime = require('mime-types');
const keyRemove = process.env.KEY_FILE_NAME;
const keyRemoval = process.env.KEY_FILE_NAME;
const keyRhotoroom = process.env.KEY_FILE_NAME;
const keyRlipdrop = process.env.KEY_FILE_NAME;
const keylazzer = process.env.KEY_FILE_NAME;

const apis = [
    { name: 'remove.bg', url: 'https://api.remove.bg/v1.0/removebg', key: process.env.KEY_REMOVE },
    { name: 'removal.ai', url: 'https://api.removal.ai/3.0/remove', key: process.env.KEY_REMOVAL },
    { name: 'photoroom.com', url: 'https://sdk.photoroom.com/v1/segment', key: process.env.KEY_PHOTOROOM },
    { name: 'clipdrop.co', url: 'https://clipdrop-api.co/remove-background/v1', key: process.env.KEY_RLIPDROP },
    { name: 'slazzer.com', url: 'https://api.slazzer.com/v2.0/remove_image_background', key: process.env.KEY_LAZZER },
];

async function removeBackground(filePath) {
    try {
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const filename = path.basename(filePath);
        const mimetype = mime.lookup(filePath) || 'application/octet-stream';
        const outputFilePath = path.join(outputDir, `${filename}`);

        console.log(`Processing file: ${filePath}`);
        console.log(`Saving output to: ${outputFilePath}`);

        const isProcessed = await processImageWithAPIs(filePath, outputFilePath, mimetype);

        if (isProcessed) {
            console.log('Image processed and saved successfully.');
        } else {
            console.error('Failed to process image.');
        }

        // Uncomment if you want to delete the original file after processing
        // fs.unlink(filePath, (err) => {
        //     if (err) console.error('Failed to delete file:', err);
        // });

    } catch (error) {
        console.error('Error processing image:', error);
    }
}

async function processImageWithAPIs(inputFilePath, outputFilePath, mimeType) {
    const imageData = fs.readFileSync(inputFilePath);

    for (const api of apis) {
        try {
            const formData = new FormData();
            formData.append('image_file', imageData, {
                contentType: mimeType,
                filename: path.basename(inputFilePath),
            });

            const response = await fetch(api.url, {
                method: 'POST',
                headers: { 'X-API-Key': api.key },
                body: formData,
            });

            if (response.ok) {
                const resultBuffer = await response.buffer();
                await addWhiteBackground(resultBuffer, outputFilePath);
                return true;
            }
        } catch (error) {
            console.error(`Error processing image with ${api.name}:`, error);
        }
    }

    console.error('Failed to process image using any API.');
    return false;
}

async function addWhiteBackground(inputBuffer, outputPath) {
    try {
        const image = sharp(inputBuffer);

        const widthInPixels = 1200;
        const heightInPixels = 1800;

        await image
            .resize(widthInPixels, heightInPixels) 
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .toFile(outputPath);
        

    } catch (error) {
        console.error('Error adding white background and resizing image:', error);
    }
}

// const filePath = 'D:\\VST1L-382_form\\image-background-remover-javascript\\Image Background Remover\\img2.jpg';
// removeBackground(filePath);

