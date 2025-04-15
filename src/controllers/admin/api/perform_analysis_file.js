const ExcelJS = require("exceljs");
const fs = require("fs");
const archiver = require("archiver");
const moment = require("moment");
const CommonUltil = require("../../../utils/common");
const {DocumentExportHistory} = require("../../../../models");

const perform =  async (req, res) => {
  let documentExportTxt = null;
  let documentExportDeclaration = null;
  let documentExportGroupVN = null;
  let documentExportGroupCN = null;

  try {
    let errorsInfo = [];
    if (!req.body.file_name) {errorsInfo.push({message: "Vui lòng nhập file name."});}
    if (errorsInfo.length !== 0) {
      throw {errors: errorsInfo, isValidateRequired: true};
    }

    const fileName = req.body.file_name;
    documentExportTxt = await DocumentExportHistory.create({
      kind: "encryptedList",
      fileName: fileName
    });
    documentExportDeclaration = await DocumentExportHistory.create({
      kind: "declarationList",
      fileName: fileName
    });
    documentExportGroupVN = await DocumentExportHistory.create({
      kind: "groupListVN",
      fileName: fileName
    });
    documentExportGroupCN = await DocumentExportHistory.create({
      kind: "groupListCN",
      fileName: fileName
    });

    const txtFilePath = `./public/export/encrypted_list/${fileName}.txt`;
    const declarationListFilePath = `./public/export/declaration_list/${fileName}_form.zip`;
    const groupVNFilePath = `./public/export/group_list_vn/${fileName}_danh_sach_vn.xlsx`;
    const groupCNFilePath = `./public/export/group_list_cn/${fileName}_danh_sach_cn.xlsx`;
    const currentDate = new Date().toLocaleDateString("en-GB");

    documentExportTxt.filePath = txtFilePath;
    documentExportDeclaration.filePath = declarationListFilePath;
    documentExportGroupVN.filePath = groupVNFilePath;
    documentExportGroupCN.filePath = groupCNFilePath;

    let usersInfo = req.body.users;

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
      const provinceCode = await CommonUltil.findCodeByName(userInfo.provinceName, null, "./src/data/tinh_tp.json");
      const districtCode = await CommonUltil.findCodeByName(userInfo.districtName, provinceCode, "./src/data/quan_huyen.json");
      const communeCode = await CommonUltil.findCodeByName(userInfo.communeName, districtCode, "./src/data/xa_phuong.json");

      console.log("========================================================================================");
      userInfo.provinceCode = provinceCode;
      userInfo.districtCode = districtCode;
      userInfo.communeCode = communeCode;
      console.log(`user${i + 1}_extractedInfo`, userInfo);
      console.log("========================================================================================");
      
      // const fullNameIso8859 = CommonUltil.convertUnicodeToIso8859Map(userInfo.fullName);
      // const villageIso8859 = CommonUltil.convertUnicodeToIso8859Map(userInfo.villageName);

      // const sqlInsert = `Insert into pa18.thv_ct values('${fileName}','${fullNameIso8859}','${userInfo.genderCode}',to_date('${userInfo.dayOfBirth}','dd/mm/yyyy'),'D','${provinceCode}','1','8','${provinceCode}','${districtCode}','${communeCode}','${villageIso8859}','','${userInfo.cardID}','${provinceCode}',to_date('${userInfo.createdAt}','dd/mm/yyyy'),'tù do','','2','1','','','','',to_date('${currentDate}','dd/mm/yyyy'),'','','',to_date('','dd/mm/yyyy'),to_date('','dd/mm/yyyy'),'','','','','',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'',to_date('','dd/mm/yyyy'),'')`;

      // EXPORT FILE MÃ HOÁ THÔNG TIN
      // fs.appendFile(txtFilePath, sqlInsert + "\n/\n", (err) => {
      //   if (err) {throw {errors: [err]};}

      //   console.log(`SQL insert statement appended to ${txtFilePath}`);
      // });

      // ZIP LẠI THÔNG TIN TỜ KHAI
      const filePathDeclaration = await exportDeclarationFile(userInfo, fileName);
      archive.file(filePathDeclaration, {name: `${i + 1}.${userInfo.fullName.toUpperCase()}.${fileName}.${userInfo.cardID}.xlsx`})
    }

    // const suffixSqlInsert = "commit" + "\r\n/\r\n" + "quit" + "\r\n/\r\n"
    // fs.appendFile(txtFilePath, suffixSqlInsert, (err) => {
    //   if (err) {throw {errors: [err]};}

    //   console.log(`SQL insert statement appended to ${txtFilePath}`);
    // });

    // EXPORT DANH SÁCH VN
    await exportGroupVN(usersInfo, fileName);

    // EXPORT DANH SÁCH CN
    await exportGroupCN(usersInfo, fileName);

    documentExportTxt.status = "success"
    await documentExportTxt.save();

    await archive.finalize();
    documentExportDeclaration.status = "success"
    await documentExportDeclaration.save();

    documentExportGroupVN.status = "success"
    await documentExportGroupVN.save();

    documentExportGroupCN.status = "success"
    await documentExportGroupCN.save();

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
    if (documentExportGroupVN) {
      documentExportGroupVN.status = "fail"
      await documentExportGroupVN.save();
    }
    if (documentExportGroupCN) {
      documentExportGroupCN.status = "fail"
      await documentExportGroupCN.save();
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
  worksheet.getCell("U8").value = user.gender === "Nu" ? "X" : "";
  worksheet.getCell("S8").value = user.gender === "Nam" ? "X" : "";
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
  worksheet.getCell("S13").value = user.villageName;
  worksheet.getCell("F14").value = user.communeName;
  worksheet.getCell("L14").value = user.districtName;
  worksheet.getCell("S14").value = user.provinceName;
  worksheet.getCell("L28").value = user.fullName.toUpperCase();
  console.log(user.cardID);
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

async function exportGroupCN(users, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("public/export/group_list_cn/group_list_cn_tmp.xlsx");
  const worksheet = workbook.getWorksheet(1);

  const sourceCell = worksheet.getCell("A1");
  const targetCell = worksheet.getCell("B2");

  targetCell.value = sourceCell.value;
  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numOrder = i + 7;
    const englishName = user.fullName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const dayOfBirth = moment(user.dayOfBirth, "DD/MM/YYYY").format("YYYYMMDD")

    const cells = [
      worksheet.getCell(`B${numOrder}`),
      worksheet.getCell(`C${numOrder}`),
      worksheet.getCell(`D${numOrder}`),
      worksheet.getCell(`E${numOrder}`),
      worksheet.getCell(`F${numOrder}`)
    ];

    cells[0].value = `${i + 1}`;
    cells[1].value = `${englishName}`;
    cells[2].value = `${user.genderCode}`;
    cells[3].value = `${dayOfBirth}`;
    cells[4].value = `${user.documentNumber}`;

    cells.forEach(cell => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  }

  const outputPath = `./public/export/group_list_cn/${fileName}_danh_sach_cn.xlsx`;

  await workbook.xlsx.writeFile(outputPath);
}

async function exportGroupVN(users, fileName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("public/export/group_list_vn/group_list_vn_tmp.xlsx");
  const worksheet = workbook.getWorksheet(1);

  const sourceCell = worksheet.getCell("A1");
  const targetCell = worksheet.getCell("B2");

  targetCell.value = sourceCell.value;
  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numOrder = i + 6;

    const cells = [
      worksheet.getCell(`B${numOrder}`),
      worksheet.getCell(`C${numOrder}`),
      worksheet.getCell(`D${numOrder}`),
      worksheet.getCell(`E${numOrder}`),
      worksheet.getCell(`F${numOrder}`),
      worksheet.getCell(`G${numOrder}`)
    ];

    cells[0].value = `${i + 1}`;
    cells[1].value = `${user.fullName.toUpperCase()}`;
    cells[2].value = `${user.genderCode}`;
    cells[3].value = `${user.dayOfBirth}`;
    cells[4].value = `${user.cardID}`;
    cells[5].value = `${user.provinceName}`;

    cells.forEach(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  const outputPath = `./public/export/group_list_vn/${fileName}_danh_sach_vn.xlsx`;

  await workbook.xlsx.writeFile(outputPath);
}

module.exports = {
  perform
};
