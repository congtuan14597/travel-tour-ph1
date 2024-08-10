const fs = require('fs');
const path = require('path');

const getFilesInfo = (req, res) => {
  const directoryPath = './public/txt';

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send({ error: 'Unable to scan directory: ' + err });
    }

    const fileInfo = files.map(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime
      };
    });

    res.status(200).json(fileInfo);
  });
};

const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('./public/txt', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).send({ error: 'Error downloading file' });
      }
    });
  } else {
    res.status(404).send({ error: 'File not found' });
  }
};

module.exports = {
  getFilesInfo,
  downloadFile
};