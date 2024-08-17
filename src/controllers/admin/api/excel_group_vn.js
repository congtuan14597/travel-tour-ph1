const ExcelJS = require('exceljs');
const fs = require('fs');

async function groupVNExcelFiles({
  fileName, stt, hoten, gioitinh, namsinh, cccd, noisinh
}) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('form_excel/form_group_vn.xlsx');
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
 
  worksheet.getCell('B6').value = `${stt}`;
  worksheet.getCell('C6').value = `${uppercasedName}`;
  worksheet.getCell('D6').value = `${gioitinh}`;
  worksheet.getCell('E6').value = `${namsinh}`;
  worksheet.getCell('F6').value = `${cccd}`;
  worksheet.getCell('G6').value = `${noisinh}`;

  const dirPath = `output/${fileName}`
  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  await workbook.xlsx.writeFile(`${dirPath}/${fileName}_danh_sach_vn.xlsx`);
  console.log('File đã được lưu thành công.');
}

groupVNExcelFiles({
  fileName: 'VST1L-999',
  stt: 1,
  hoten: "lê hải đăng lâm",
  gioitinh: "M",
  namsinh: "08/06/2000", //format dd/mm/yyyy
  cccd: "12345678911214",
  noisinh: "Quang Tri",
}).catch(console.error);
