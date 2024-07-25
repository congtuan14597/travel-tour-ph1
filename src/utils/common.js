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
  const unicodeToTcvn3Map = {
    "à": "µ", "á": "¸", "ả": "¶", "ã": "·", "ạ": "¹",
    "ă": "¨", "ằ": "»", "ắ": "¾", "ẳ": "¼", "ẵ": "½", "ặ": "»",
    "â": "©", "ầ": "Ç", "ấ": "Ê", "ẩ": "È", "ẫ": "É", "ậ": "Ç",
    "đ": "Ð",
    "è": "Ì", "é": "Î", "ẻ": "Í", "ẽ": "Ï", "ẹ": "Ñ",
    "ê": "ª", "ề": "Ò", "ế": "Õ", "ể": "Ó", "ễ": "Ô", "ệ": "Ò",
    "ì": "Ò", "í": "Ó", "ỉ": "Ô", "ĩ": "Õ", "ị": "Ö",
    "ò": "Ø", "ó": "Ü", "ỏ": "Ø", "õ": "Ù", "ọ": "Ý",
    "ô": "«", "ồ": "Ø", "ố": "Ü", "ổ": "Ù", "ỗ": "Ú", "ộ": "Ý",
    "ơ": "¬", "ờ": "×", "ớ": "Ø", "ở": "Ü", "ỡ": "Ù", "ợ": "Ý",
    "ù": "Þ", "ú": "ß", "ủ": "Ý", "ũ": "Û", "ụ": "Þ",
    "ư": "­", "ừ": "ç", "ứ": "è", "ử": "é", "ữ": "ê", "ự": "ë",
    "ỳ": "ï", "ý": "ó", "ỷ": "ñ", "ỹ": "ò", "ỵ": "ó",

    "À": "µ", "Á": "¸", "Ả": "¶", "Ã": "·", "Ạ": "¹",
    "Ă": "¨", "Ằ": "»", "Ắ": "¾", "Ẳ": "¼", "Ẵ": "½", "Ặ": "»",
    "Â": "©", "Ầ": "Ç", "Ấ": "Ê", "Ẩ": "È", "Ẫ": "É", "Ậ": "Ç",
    "Đ": "Ð",
    "È": "Ì", "É": "Î", "Ẻ": "Í", "Ẽ": "Ï", "Ẹ": "Ñ",
    "Ê": "ª", "Ề": "Ò", "Ế": "Õ", "Ể": "Ó", "Ễ": "Ô", "Ệ": "Ò",
    "Ì": "Ò", "Í": "Ó", "Ỉ": "Ô", "Ĩ": "Õ", "Ị": "Ö",
    "Ò": "Ø", "Ó": "Ü", "Ỏ": "Ø", "Õ": "Ù", "Ọ": "Ý",
    "Ô": "«", "Ồ": "Ø", "Ố": "Ü", "Ổ": "Ù", "Ỗ": "Ú", "Ộ": "Ý",
    "Ơ": "¬", "Ờ": "×", "Ớ": "Ø", "Ở": "Ü", "Ỡ": "Ù", "Ợ": "Ý",
    "Ù": "Þ", "Ú": "ß", "Ủ": "Ý", "Ũ": "Û", "Ụ": "Þ",
    "Ư": "­", "Ừ": "ç", "Ứ": "è", "Ử": "é", "Ữ": "ê", "Ự": "ë",
    "Ỳ": "ï", "Ý": "ó", "Ỷ": "ñ", "Ỹ": "ò", "Ỵ": "ó"
  };

  return input.split("").map(char => unicodeToTcvn3Map[char] || char).join("");
};

module.exports = {
  findCodeByName,
  convertUnicodeToTcvn3Map
};
