const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function groupCNExcelFiles({
  fileName, stt, hoten, gioitinh, namsinh, cccd
}) {
  const excelFile = path.join(__dirname, './form_excel/form_group_cn.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFile);
  const worksheet = workbook.getWorksheet(1); 

  const sourceCell = worksheet.getCell('A1');
  const targetCell = worksheet.getCell('B2');

  targetCell.value = sourceCell.value;

  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  const uppercasedName = hoten.toUpperCase();
  const englishName = uppercasedName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // let startRow = 10;
  // let startCol = 'G'.charCodeAt(0); 
  
  // digits.forEach((digit, index) => {
  //   const cellAddress = String.fromCharCode(startCol + index) + startRow;
  //   const cellcc = worksheet.getCell(cellAddress);
  //   cellcc.value = `${digit}`;
    
  //   cellcc.font = {
  //     bold: true, 
  //   };

  //   cellcc.border = {
  //     top: { style: 'thin' },
  //     left: { style: 'thin' },
  //     bottom: { style: 'thin' },
  //     right: { style: 'thin' },
  //   };
  // });
  worksheet.getCell(`B${stt}`).value = `${stt}`;
  worksheet.getCell(`C${stt}`).value = `${englishName}`;
  worksheet.getCell(`D${stt}`).value = `${gioitinh}`;
  worksheet.getCell(`E${stt}`).value = `${namsinh}`;
  worksheet.getCell(`F${stt}`).value = '';
  worksheet.getCell(`G${stt}`).value = `${cccd}`;

  const dirPath = path.join(__dirname, `./output/${fileName}`);
  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  await workbook.xlsx.writeFile(`${dirPath}/${fileName}_danh_sach_cn.xlsx`);
  console.log('File đã được lưu thành công.');
}

// groupCNExcelFiles({
//   fileName: 'VST1L-999',
//   stt: 1,
//   hoten: "lê hải đăng lâm",
//   gioitinh: "M",
//   namsinh: "08062000", //format ddmmyyy
//   cccd: "12345678911214",
//   noisinh: "Quang Tri",
// }).catch(console.error);


module.exports = {
  groupCNExcelFiles
};
