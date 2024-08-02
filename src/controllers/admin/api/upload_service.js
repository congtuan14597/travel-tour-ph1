// Service (upload_service.js)
const path = require('path');
const fs = require('fs');

// Set up the directory for uploads
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const uploadFiles = (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // Process each file
  const fileDetails = files.map(file => {
    // Create a unique filename to avoid conflicts
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Move the file to the uploads directory
    fs.renameSync(file.path, filePath);

    return {
      name: file.originalname,
      url: `/uploads/${uniqueFilename}`,
      uploadedAt: new Date(),
    };
  });

  // Return file information
  res.status(200).json({ files: fileDetails });
};

const getUploadedFiles = (req, res) => {
  if (!fs.existsSync(uploadDir)) {
    return res.status(200).json({ files: [] });
  }

  try {
    // Read the files in the uploadDir
    const files = fs.readdirSync(uploadDir).map(fileName => {
      const filePath = path.join(uploadDir, fileName);

      try {
        const stats = fs.statSync(filePath);

        // Ensure the file is a regular file and not a directory
        if (stats.isFile()) {
          return {
            name: fileName,
            url: `/uploads/${fileName}`,
            uploadedAt: stats.birthtime,
          };
        }
      } catch (err) {
        console.error('Error reading file:', fileName, err);
      }

      return null;
    }).filter(file => file !== null);

    res.status(200).json({ files });
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).json({ error: 'Error reading files' });
  }
};

module.exports = {
  uploadFiles,
  getUploadedFiles,
};
