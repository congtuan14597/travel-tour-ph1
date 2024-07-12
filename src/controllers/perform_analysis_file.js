const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const processFile = require("../middleware/upload");

const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;

const genAI = new GoogleGenerativeAI(GOOGLE_AI_KEY);

function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    }
  };
}

const perform =  async (req, res) => {
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const question = req.body.question || "";

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype || "application/octet-stream";

    const imageParts = [
      fileToGenerativePart(buffer, mimeType),
    ];

    const result = await model.generateContent([question, ...imageParts]);
    const response = result.response;
    const text = await response.text();

    const uploadsDir = path.join(__dirname, "../../public/txt");
    // TODO: rename file export output by ID CCCD and Name (need confirm)
    const filePath = path.join(uploadsDir, "output.txt");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    fs.writeFileSync(filePath, text, "utf-8");

    res.status(200).send({
      message: "Perform the file successfully: " + req.file.originalname,
      answer: text
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    if (error.response) {
      console.error("Error details:", await error.response.text());
    }
  }
}

module.exports = {
  perform
};
