const { ImageAnnotatorClient } = require("@google-cloud/vision");
const ExcelJS = require("exceljs");
const fs = require("fs");
const archiver = require("archiver");
const processFile = require("../../../middleware/upload");
const {CommonConstant} = require("../../../constants/common");
const CommonUltil = require("../../../utils/common");
const {DocumentExportHistory} = require("../../../../models");

const perform =  async (req, res) => {
  const keyFilename = process.env.KEY_FILE_NAME;
  const client = new ImageAnnotatorClient({ keyFilename });
  let documentExportTxt = null;
  let documentExportDeclaration = null;

  try {
    await processFile(req, res);

    let errorsInfo = [];
    if (!req.body.fileName) {errorsInfo.push({message: "Vui lòng nhập file name."});}
    if (!req.files || req.files.length === 0) {
      errorsInfo.push({message: "Vui lòng chọn file để trích xuất."});
    }
    if (errorsInfo.length !== 0) {
      throw {errors: errorsInfo, isValidateRequired: true};
    }

    const fileName = req.body.fileName;
    documentExportTxt = await DocumentExportHistory.create({
      kind: "encryptedList",
      fileName: fileName
    });
    documentExportDeclaration = await DocumentExportHistory.create({
      kind: "declarationList",
      fileName: fileName
    });

    let usersInfo = [];
    for (let i = 1; i < Object.entries(req.body).length; i++) {
      let userFilesByIndex = req.files.filter(item => item.fieldname.startsWith(`user${i}`));
      let extractedInfo = {};
      for (let file of userFilesByIndex) {
        if (!file.buffer) {continue;}

        const [result] = await client.textDetection(file.buffer);
        const detections = result.textAnnotations;
        const fullText = detections[0]?.description;
        if (!fullText) {continue;}

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
        let createdAt = "";
        if (file.fieldname === `user${i}[backImage]`) {
          createdAt = fullText.match(CommonConstant.CREATED_AT)?.[0] || "";
        }

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
        if (addressArray[1]?.length != 0) {districtName = addressArray[1]?.trim();}
        if (addressArray[2]?.length != 0) {communeName = addressArray[2]?.trim();}
        if (addressArray[3]?.length != 0) {extractedInfo.village = addressArray[3]?.trim()?.toLocaleLowerCase();}

        provinceCode = await CommonUltil.findCodeByName(provinceName, null, "./src/data/tinh_tp.json");
        extractedInfo.provinceCode = provinceCode;
        extractedInfo.provinceName = provinceName;

        districtCode = await CommonUltil.findCodeByName(districtName, provinceCode, "./src/data/quan_huyen.json");
        extractedInfo.districtCode = districtCode;
        extractedInfo.districtName = districtName;

        communeCode = await CommonUltil.findCodeByName(communeName, districtCode, "./src/data/xa_phuong.json");
        extractedInfo.communeCode = communeCode;
        extractedInfo.communeName = communeName;
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
      console.log("========================================================================================");
      console.log("extractedInfo", extractedInfo);
      console.log("========================================================================================");
    }

    if (errorsInfo.length !== 0) {throw {errors: errorsInfo};}

    const txtFilePath = `./public/export/encrypted_list/${fileName}.txt`;
    const declarationListFilePath = `./public/export/declaration_list/${fileName}.zip`;
    const currentDate = new Date().toLocaleDateString("en-GB");

    documentExportTxt.filePath = txtFilePath;
    documentExportDeclaration.filePath = declarationListFilePath;

    const output = fs.createWriteStream(declarationListFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 }
    });
    output.on("close", function() {
      console.log(archive.pointer() + " bytes tổng cộng");
      console.log(`File zip đã được lưu tại ${declarationListFilePath}`);
      for (const user of usersInfo) {
        const filePath = `./public/export/declaration_list/${fileName}_${user.cardID}.xlsx`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    archive.on("error", function(err) {
      throw err;
    });

    archive.pipe(output);

    for (let i = 0; i < usersInfo.length; i++) {
      let userInfo = usersInfo[i];

      console.log("========================================================================================");
      console.log(`user${i + 1}_extractedInfo`, userInfo);
      console.log("========================================================================================");

      const fullNameTCVN3 = CommonUltil.convertUnicodeToTcvn3Map(userInfo.fullName);
      const villageTCVN3 = CommonUltil.convertUnicodeToTcvn3Map(userInfo.village);
      const genderCode = userInfo.gender === "Nam" ? "M" : "F";

      const sqlInsert = `Insert into pa18.thv_ct values('${fileName}','${fullNameTCVN3}','${genderCode}',to_date('${userInfo.dayOfBirth}','dd/mm/yyyy'),'D','${userInfo.provinceCode}','1','8','${userInfo.provinceCode}','${userInfo.districtCode}','${userInfo.communeCode}','${villageTCVN3}','','${userInfo.cardID}','${userInfo.provinceCode}',to_date('${userInfo.createdAt}','dd/mm/yyyy'),'tù do','','2','1','','','','',to_date('${currentDate}','dd/mm/yyyy'),'','','',to_date('','dd/mm/yyyy'),to_date('','dd/mm/yyyy'),'','','','','',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'')`;

      fs.appendFile(txtFilePath, sqlInsert + "\n/\n", (err) => {
        if (err) {throw {errors: [err]};}

        console.log(`SQL insert statement appended to ${txtFilePath}`);
      });

      // ZIP LẠI THÔNG TIN TỜ KHAI
      const filePathDeclaration = await exportDeclarationFile(userInfo, fileName);
      archive.file(filePathDeclaration, {name: `${userInfo.fullName.toUpperCase()}.xlsx`})
    }

    documentExportTxt.status = "success"
    await documentExportTxt.save();

    await archive.finalize();
    documentExportDeclaration.status = "success"
    await documentExportDeclaration.save();

    return res.status(200).json({success: true, message: "Trích xuất thông tin thành công!"});
  } catch (error) {
    if (documentExportTxt) {
      documentExportTxt.status = "fail"
      await documentExportTxt.save();
    }
    if (documentExportDeclaration) {
      documentExportDeclaration.status = "fail"
      await documentExportDeclaration.save();
    }

    console.error("Error during file upload:", error);

    return res.status(500).json({success: false, errors: error.errors, isValidateRequired: error.isValidateRequired});
  }
}

async function exportDeclarationFile(user, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("public/export/declaration_list/declaration_tmp.xlsx");
  const worksheet = workbook.getWorksheet(1);

  const sourceCell = worksheet.getCell("A1");
  const targetCell = worksheet.getCell("B2");
  targetCell.value = sourceCell.value;
  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  const dayOfBirths = user.dayOfBirth.split("/");
  const createdAts = user.createdAt.split("/");
  worksheet.getCell("H8").value = user.fullName.toUpperCase();
  worksheet.getCell("U8").value = user.gender === "Nam" ? "X" : "";
  worksheet.getCell("S8").value = user.gender === "Nu" ? "X" : "";
  worksheet.getCell("E9").value = dayOfBirths[0];
  worksheet.getCell("I9").value = dayOfBirths[1];
  worksheet.getCell("L9").value = dayOfBirths[2];
  worksheet.getCell("R9").value = user.provinceName;
  worksheet.getCell("F11").value = createdAts[0];
  worksheet.getCell("H11").value = createdAts[1];
  worksheet.getCell("J11").value = createdAts[2];
  worksheet.getCell("S11").value = user.provinceName;
  worksheet.getCell("E12").value = "Kinh";
  worksheet.getCell("K12").value = "Không";
  worksheet.getCell("S13").value = user.village;
  worksheet.getCell("F14").value = user.communeName;
  worksheet.getCell("L14").value = user.districtName;
  worksheet.getCell("S14").value = user.provinceName;
  worksheet.getCell("L28").value = user.fullName.toUpperCase();

  const digits = user.cardID.split("");
  let startRow = 10;
  let startCol = "G".charCodeAt(0);

  digits.forEach((digit, index) => {
    const cellAddress = String.fromCharCode(startCol + index) + startRow;
    const cellcc = worksheet.getCell(cellAddress);
    cellcc.value = digit;
    cellcc.font = { bold: true };
    cellcc.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  const outputPath = `./public/export/declaration_list/${fileName}_${user.cardID}.xlsx`;

  await workbook.xlsx.writeFile(outputPath);

  return outputPath;
};

module.exports = {
  perform
};
