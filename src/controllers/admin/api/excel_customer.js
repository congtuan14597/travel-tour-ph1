const ExcelJS = require('exceljs');
const fs = require('fs');

async function customerExcelFiles({
  fileName, name, gioitinh, day, month, year,
  tinh_cc, cccd, ngaycc, thangcc, namcc, tinhcc, dantoc, tongiao,
  thon, phuong, quan, tinh
}) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('form_excel/form_customer.xlsx');
  const worksheet = workbook.getWorksheet(1); 

  const sourceCell = worksheet.getCell('A1');
  const targetCell = worksheet.getCell('B2');

  targetCell.value = sourceCell.value;

  targetCell.fill = sourceCell.fill;
  targetCell.font = sourceCell.font;
  targetCell.border = sourceCell.border;
  targetCell.alignment = sourceCell.alignment;
  targetCell.numberFormat = sourceCell.numberFormat;

  const uppercasedName = name.toUpperCase();
  
  const digits = cccd.split("");
  
  let startRow = 10;
  let startCol = 'G'.charCodeAt(0); 
  
  digits.forEach((digit, index) => {
    const cellAddress = String.fromCharCode(startCol + index) + startRow;
    const cellcc = worksheet.getCell(cellAddress);
    cellcc.value = `${digit}`;
    
    cellcc.font = {
      bold: true, 
    };

    cellcc.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
 
  let nam = "";
  let nu = "";
  
  if (gioitinh == "nam") {
      nam = "X";
  } else if (gioitinh == "nu") {
      nu = "X";
  }

  worksheet.getCell('H8').value = `${uppercasedName}`;
  worksheet.getCell('U8').value = `${nam}`;
  worksheet.getCell('S8').value = `${nu}`;
  worksheet.getCell('E9').value = `${day}`;
  worksheet.getCell('I9').value = `${month}`;
  worksheet.getCell('L9').value = `${year}`;
  worksheet.getCell('R9').value = `${tinh_cc}`;
  worksheet.getCell('F11').value = `${ngaycc}`;
  worksheet.getCell('H11').value = `${thangcc}`;
  worksheet.getCell('J11').value = `${namcc}`;
  worksheet.getCell('S11').value = `${tinhcc}`;
  worksheet.getCell('E12').value = `${dantoc}`;
  worksheet.getCell('K12').value = `${tongiao}`;
  worksheet.getCell('S13').value = `${thon}`;
  worksheet.getCell('F14').value = `${phuong}`;
  worksheet.getCell('L14').value = `${quan}`;
  worksheet.getCell('S14').value = `${tinh}`;
  worksheet.getCell('L28').value = `${uppercasedName}`;

  const dirPath = `output/${fileName}`
  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  await workbook.xlsx.writeFile(`${dirPath}/${uppercasedName}.xlsx`);
  console.log('File đã được lưu thành công.');
}

customerExcelFiles({
  fileName: 'VST1L-999',
  name: "lê hải đăng lâm",
  gioitinh: "nam",
  day: "18",
  month: "5",
  year: "2022",
  tinh_cc: "Quảng Trị",
  cccd: "12345678912121",
  ngaycc: "",
  thangcc: "18",
  namcc: "5",
  tinhcc: "2022",
  dantoc: "Kinh",
  tongiao: "X",
  thon: "Hoàn Cát",
  phuong: "Cam Nghĩa",
  quan: "Cam Lộ",
  tinh: "2022"
}).catch(console.error);
