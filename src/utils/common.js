const fs = require("fs").promises;

const findCodeByName = async function (name, referCode, filePath) {
  let resultData = [];

  try {
    const fileData = await fs.readFile(filePath, "utf8");
    resultData = JSON.parse(fileData);
  } catch (err) {
    console.error("Error reading file:", err);
    return "";
  }

  const result = resultData.filter(item => {
    return Object.keys(item).some(key => key.includes(name));
  });

  if (result.length === 0) { return ""; }

  if (result.length === 1) {
    const key = Object.keys(result[0]).find(key => key.includes(name));
    if (result[0][key].split(", ").length > 1) { return result[0][key].split(", ")[0]; }
    return result[0][key];
  }

  if (result.length > 1) {
    const resultWithReferCode = result.find(item => {
      const key = Object.keys(item).find(key => key.includes(name));
      return item[key].includes(referCode);
    });

    if (!resultWithReferCode) {
      return "";
    }

    const key = Object.keys(resultWithReferCode).find(key => key.includes(name));
    return resultWithReferCode[key].replace(`, ${referCode}`, "");
  }
};

const convertUnicodeToTcvn3Map = function (input) {
  const unicodeChars = [
    "À", "Á", "Â", "Ã", "È", "É", "Ê", "Ì", "Í", "Ò",
    "Ó", "Ô", "Õ", "Ù", "Ú", "Ý", "à", "á", "â", "ã",
    "è", "é", "ê", "ì", "í", "ò", "ó", "ô", "õ", "ù",
    "ú", "ý", "Ă", "ă", "Đ", "đ", "Ĩ", "ĩ", "Ũ", "ũ",
    "Ơ", "ơ", "Ư", "ư", "Ạ", "ạ", "Ả", "ả", "Ấ", "ấ",
    "Ầ", "ầ", "Ẩ", "ẩ", "Ẫ", "ẫ", "Ậ", "ậ", "Ắ", "ắ",
    "Ằ", "ằ", "Ẳ", "ẳ", "Ẵ", "ẵ", "Ặ", "ặ", "Ẹ", "ẹ",
    "Ẻ", "ẻ", "Ẽ", "ẽ", "Ế", "ế", "Ề", "ề", "Ể", "ể",
    "Ễ", "ễ", "Ệ", "ệ", "Ỉ", "ỉ", "Ị", "ị", "Ọ", "ọ",
    "Ỏ", "ỏ", "Ố", "ố", "Ồ", "ồ", "Ổ", "ổ", "Ỗ", "ỗ",
    "Ộ", "ộ", "Ớ", "ớ", "Ờ", "ờ", "Ở", "ở", "Ỡ", "ỡ",
    "Ợ", "ợ", "Ụ", "ụ", "Ủ", "ủ", "Ứ", "ứ", "Ừ", "ừ",
    "Ử", "ử", "Ữ", "ữ", "Ự", "ự", "Ỳ", "ỳ", "Ỵ", "ỵ",
    "Ỷ", "ỷ", "Ỹ", "ỹ"
  ];

  const tcvn3Chars = [
    "Aµ", "A¸", "¢", "A·", "EÌ", "EÐ", "£", "I×", "IÝ", "Oß",
    "Oã", "¤", "Oâ", "Uï", "Uó", "Yý", "µ", "¸", "©", "·",
    "Ì", "Ð", "ª", "×", "Ý", "ß", "ã", "«", "â", "ï",
    "ó", "ý", "¡", "¨", "§", "®", "IÜ", "Ü", "Uò", "ò",
    "¥", "¬", "¦", "­", "A¹", "¹", "A¶", "¶", "¢Ê", "Ê",
    "¢Ç", "Ç", "¢È", "È", "¢É", "É", "¢Ë", "Ë", "¡¾", "¾",
    "¡»", "»", "¡¼", "¼", "¡½", "½", "¡Æ", "Æ", "EÑ", "Ñ",
    "EÎ", "Î", "EÏ", "Ï", "£Õ", "Õ", "£Ò", "Ò", "£Ó", "Ó",
    "£Ô", "Ô", "£Ö", "Ö", "IØ", "Ø", "IÞ", "Þ", "Oä", "ä",
    "Oá", "á", "¤è", "è", "¤å", "å", "¤æ", "æ", "¤ç", "ç",
    "¤é", "é", "¥í", "í", "¥ê", "ê", "¥ë", "ë", "¥ì", "ì",
    "¥î", "î", "Uô", "ô", "Uñ", "ñ", "¦ø", "ø", "¦õ", "õ",
    "¦ö", "ö", "¦÷", "÷", "¦ù", "ù", "Yú", "ú", "Yþ", "þ",
    "Yû", "û", "Yü", "ü"
  ];

  return input.split('').map(char => {
    const index = unicodeChars.indexOf(char);
    return index !== -1 ? tcvn3Chars[index] : char;
  }).join('');
};

module.exports = {
  findCodeByName,
  convertUnicodeToTcvn3Map
};
