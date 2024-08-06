const { ImageAnnotatorClient } = require("@google-cloud/vision");
const fs = require("fs");
const processFile = require("../../../middleware/upload");
const {CommonConstant} = require("../../../constants/common");
const CommonUltil = require("../../../utils/common");

const perform =  async (req, res) => {
  const keyFilename = process.env.KEY_FILE_NAME;
  const client = new ImageAnnotatorClient({ keyFilename });

  try {
    await processFile(req, res);

    let errorsInfo = [];
    if (!req.body.fileName) {errorsInfo.push({message: "Vui lòng nhập file name."});}
    if (!req.files || req.files.length === 0) {
      errorsInfo.push({message: "Vui lòng chọn file để trích xuất."});
    }
    if (errorsInfo.length !== 0) {
      return res.status(400).send({
        success: false,
        isValidateRequired: true,
        errors: errorsInfo
      });
    }

    let usersInfo = [];
    for (let i = 1; i < Object.entries(req.body).length; i++) {
      let userFilesByIndex = req.files.filter(item => item.fieldname.startsWith(`user${i}`));
      let extractedInfo = {};
      for (let file of userFilesByIndex) {
        if (!file.buffer) {continue;}

        const [result] = await client.textDetection(file.buffer);
        const detections = result.textAnnotations;
        const fullText = detections[0].description;

        let cardID = fullText.match(CommonConstant.IDCARD_NUMBER_REGEX)?.[0] || ""
        let fullName = fullText.match(CommonConstant.FULL_NAME_REGEX)?.[1]?.trim()?.replace("\n", " ") || "";
        let dayOfBirth = fullText.match(CommonConstant.DAY_OF_BIRTH_REGEX)?.[1] || "";
        let gender = fullText.match(CommonConstant.GENDER_REGEX)?.[1] || "";
        let address = "";
        let village = "";
        if (fullText.match(CommonConstant.ADDRESS_REGEX)) {
          const result = fullText.match(CommonConstant.ADDRESS_REGEX).filter(item => item !== undefined);
          address = result[2].trim().replace(/\s+/g, " ");
          village = result[1];
        }
        let createdAt = fullText.match(CommonConstant.CREATED_AT)?.[0] || "";

        console.log("========================================================================================");
        console.log(`user${i}_fullText`, fullText);
        console.log("========================================================================================");

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
        if (!extractedInfo.village || extractedInfo.village.length === 0) {
          extractedInfo.village = village.toLocaleLowerCase();
        }
        extractedInfo.createdAt = createdAt;

        if (address.length != 0) {
          let communeCode = "";
          let districtCode = "";
          let provinceCode = "";

          let addressArray = address.split(", ").reverse();
          provinceName = addressArray[0].trim();
          if (addressArray[1].length != 0) {districtName = addressArray[1].trim();}
          if (addressArray[2].length != 0) {communeName = addressArray[2].trim();}

          provinceCode = await CommonUltil.findCodeByName(provinceName, null, "./src/data/tinh_tp.json");
          extractedInfo.provinceCode = provinceCode;

          districtCode = await CommonUltil.findCodeByName(districtName, provinceCode, "./src/data/quan_huyen.json");
          extractedInfo.districtCode = districtCode;

          communeCode = await CommonUltil.findCodeByName(communeName, districtCode, "./src/data/xa_phuong.json");
          extractedInfo.communeCode = communeCode;
        }
      }

      let userInfo = req.body[`user${i}`]
      if (userInfo.fullName && userInfo.fullName.length !== 0) {
        extractedInfo.fullName = userInfo.fullName;
      }
      if (userInfo.cardID && userInfo.cardID.length !== 0) {
        extractedInfo.cardID = userInfo.cardID;
      }
      if (userInfo.birthDate && userInfo.birthDate.length !== 0) {
        const [year, month, day] = userInfo.birthDate.split("-");
        extractedInfo.dayOfBirth = `${day}/${month}/${year}`;
      }
      if (userInfo.gender && userInfo.gender.length !== 0) {
        extractedInfo.gender = userInfo.gender;
      }
      if (userInfo.createdAt && userInfo.createdAt.length !== 0) {
        const [year, month, day] = userInfo.createdAt.split("-");
        extractedInfo.createdAt = `${day}/${month}/${year}`;
      }
      if (userInfo.address && userInfo.address.length !== 0) {
        let communeCode = "";
        let districtCode = "";
        let provinceCode = "";

        let addressArray = userInfo.address.split(", ").reverse();
        let provinceName = addressArray[0].trim();
        if (addressArray[1].length != 0) {districtName = addressArray[1].trim();}
        if (addressArray[2].length != 0) {communeName = addressArray[2].trim();}
        if (addressArray[3].length != 0) {extractedInfo.village = addressArray[3].trim().toLocaleLowerCase();}

        provinceCode = await CommonUltil.findCodeByName(provinceName, null, "./src/data/tinh_tp.json");
        extractedInfo.provinceCode = provinceCode;

        districtCode = await CommonUltil.findCodeByName(districtName, provinceCode, "./src/data/quan_huyen.json");
        extractedInfo.districtCode = districtCode;

        communeCode = await CommonUltil.findCodeByName(communeName, districtCode, "./src/data/xa_phuong.json");
        extractedInfo.communeCode = communeCode;
      }

      if (!extractedInfo.cardID || !extractedInfo.fullName || !extractedInfo.dayOfBirth ||
        !extractedInfo.gender || !extractedInfo.createdAt || !extractedInfo.communeCode ||
        !extractedInfo.districtCode || !extractedInfo.provinceCode) {
        errorsInfo.push(
          {
            message: "Thông tin trích xuất không chính xác, vui lòng nhập các thông tin bên dưới.",
            index: i
          }
        )
      } else {
        usersInfo.push(extractedInfo)
      }
    }

    if (errorsInfo.length !== 0) {
      return res.status(400).send({
        success: false,
        errors: errorsInfo
      });
    }

    const currentDate = new Date().toLocaleDateString("en-GB");
    for (let i = 0; i < usersInfo.length; i++) {
      let userInfo = usersInfo[i];

      console.log("========================================================================================");
      console.log(`user${i + 1}_extractedInfo`, userInfo);
      console.log("========================================================================================");

      const fileName = req.body.fileName;
      const fullNameTCVN3 = CommonUltil.convertUnicodeToTcvn3Map(userInfo.fullName);
      const villageTCVN3 = CommonUltil.convertUnicodeToTcvn3Map(userInfo.village);
      const genderCode = userInfo.gender === "Nam" ? "M" : "F";

      const sqlInsert = `Insert into pa18.thv_ct values('${fileName}','${fullNameTCVN3}','${genderCode}',to_date('${userInfo.dayOfBirth}','dd/mm/yyyy'),'D','${userInfo.provinceCode}','1','8','${userInfo.provinceCode}','${userInfo.districtCode}','${userInfo.communeCode}','${villageTCVN3}','','${userInfo.cardID}','${userInfo.provinceCode}',to_date('${userInfo.createdAt}','dd/mm/yyyy'),'tù do','','2','1','','','','',to_date('${currentDate}','dd/mm/yyyy'),'','','',to_date('','dd/mm/yyyy'),to_date('','dd/mm/yyyy'),'','','','','',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'')`;

      const txtFilePath = `./public/txt/${fileName}.txt`;
      fs.appendFile(txtFilePath, sqlInsert + "\n/\n", (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to save SQL insert statement to file", details: err });
        }
        console.log(`SQL insert statement appended to ${txtFilePath}`);
      });
    }

    res.status(200).json({success: true, message: "Trích xuất thông tin thành công!"});
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({success: false, errors: [error]});
  }
}

module.exports = {
  perform
};
