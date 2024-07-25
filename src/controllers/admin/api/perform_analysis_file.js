const { ImageAnnotatorClient } = require("@google-cloud/vision");
const fs = require("fs");
const iconv = require("iconv-lite");
const processFile = require("../../../middleware/upload");
const {CommonConstant} = require("../../../constants/common");
const CommonUltil = require("../../../utils/common");

const perform =  async (req, res) => {
  const keyFilename = process.env.KEY_FILE_NAME;
  const client = new ImageAnnotatorClient({ keyFilename });

  try {
    await processFile(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    let extractedInfo = {};
    for (const file of req.files) {
      const [result] = await client.textDetection(file.buffer);
      const detections = result.textAnnotations;
      const fullText = detections[0].description;

      let cardID = fullText.match(CommonConstant.IDCARD_NUMBER_REGEX)?.[0] || ""
      let fullName = fullText.match(CommonConstant.FULL_NAME_REGEX)?.[1]?.trim().replace("\n", " ") || "";
      let dayOfBirth = fullText.match(CommonConstant.DAY_OF_BIRTH_REGEX)?.[1] || "";
      let gender = fullText.match(CommonConstant.GENDER_REGEX)?.[1] || "";
      let national = fullText.match(CommonConstant.NATIONAL_REGEX)?.[1] || "";
      let address = "";
      let village = "";
      if (fullText.match(CommonConstant.ADDRESS_REGEX)) {
        const result = fullText.match(CommonConstant.ADDRESS_REGEX).filter(item => item !== undefined);
        address = result[2].trim().replace(/\s+/g, " ");
        village = result[1];
      }
      let createdAt = fullText.match(CommonConstant.CREATED_AT)?.[0] || "";

      console.log("======================");
      console.log("fullText", fullText);
      console.log("======================");

      if (!extractedInfo.cardID || extractedInfo.cardID.length === 0) {
        extractedInfo.cardID = cardID;
      }
      if (!extractedInfo.fullName || extractedInfo.fullName.length === 0) {
        extractedInfo.fullName = fullName.toLowerCase();
      }
      if (!extractedInfo.dayOfBirth || extractedInfo.dayOfBirth.length === 0) {
        extractedInfo.dayOfBirth = dayOfBirth;
      }
      if (!extractedInfo.gender || extractedInfo.gender.length === 0) {
        extractedInfo.gender = gender;
      }
      if (!extractedInfo.national || extractedInfo.national.length === 0) {
        extractedInfo.national = national;
      }
      if (!extractedInfo.address || extractedInfo.address.length === 0) {
        extractedInfo.address = address;
      }
      if (!extractedInfo.village || extractedInfo.village.length === 0) {
        extractedInfo.village = village.toLocaleLowerCase();
      }
      extractedInfo.createdAt = createdAt;

      if (extractedInfo.address.length != 0) {
        let communeCode = "";
        let districtCode = "";
        let provinceCode = "";

        let addressArray = extractedInfo.address.split(", ").reverse();
        extractedInfo.province = addressArray[0].trim();
        if (addressArray[1].length != 0) {extractedInfo.district = addressArray[1].trim();}
        if (addressArray[2].length != 0) {extractedInfo.commune = addressArray[2].trim();}

        provinceCode = await CommonUltil.findCodeByName(extractedInfo.province, null, "./src/data/tinh_tp.json");
        extractedInfo.provinceCode = provinceCode;

        districtCode = await CommonUltil.findCodeByName(extractedInfo.district, provinceCode, "./src/data/quan_huyen.json");
        extractedInfo.districtCode = districtCode;

        communeCode = await CommonUltil.findCodeByName(extractedInfo.commune, districtCode, "./src/data/xa_phuong.json");
        extractedInfo.communeCode = communeCode;
      }
    }

    console.log("======================");
    console.log("extractedInfo", extractedInfo);
    console.log("======================");

    // const fullNameTCVN3 = CommonUltil.convertUnicodeToTcvn3Map(extractedInfo.fullName);
    // const villageTCVN3 = CommonUltil.convertUnicodeToTcvn3Map(extractedInfo.village);
    const genderCode = extractedInfo.gender === "Nam" ? "M" : "F";

    const currentDate = new Date().toLocaleDateString("en-GB");
    const sqlInsert = `Insert into pa18.thv_ct values('VST1L-369','${extractedInfo.fullName}','${genderCode}',to_date('${extractedInfo.dayOfBirth}','dd/mm/yyyy'),'D','${extractedInfo.provinceCode}','1','8','${extractedInfo.provinceCode}','${extractedInfo.districtCode}','${extractedInfo.communeCode}','${extractedInfo.village}','','${extractedInfo.cardID}','${extractedInfo.provinceCode}',to_date('${extractedInfo.createdAt}','dd/mm/yyyy'),'tự do','','2','1','','','','',to_date('${currentDate}','dd/mm/yyyy'),'','','',to_date('','dd/mm/yyyy'),to_date('','dd/mm/yyyy'),'','','','','',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'')`;

    const txtFilePath = "./public/txt/VST1L-369.txt";
    fs.appendFile(txtFilePath, sqlInsert + "\n/\n", (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save SQL insert statement to file", details: err });
      }
      console.log(`SQL insert statement appended to ${txtFilePath}`);
    });

    res.status(200).json({success: true});
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({success: false, errors: [error]});
  }
}

module.exports = {
  perform
};
