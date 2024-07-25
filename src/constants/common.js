const CommonConstant = {
  IDCARD_NUMBER_REGEX: /\b\d{12}\b/g,
  FULL_NAME_REGEX: /Họ và tên [\/I] Full name[.:]?\s*([A-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểẾỄỆỈỊỌỎỐỒỔỖỘỚờởỡợỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹỲỴỶỸ]+)\b|Ho va ten [\/] Full name:\s*([A-Z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểẾỄỆỈỊỌỎỐỒỔỖỘỚờởỡợỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹỲỴỶỸ]+)\b/,
  DAY_OF_BIRTH_REGEX: /Ngày sinh [\/I1|] Date of birth[.:]?\s*(\d{2}\/\d{2}\/\d{4})|Ngày sinh[\/]Date of birth:\s*(\d{2}\/\d{2}\/\d{4})/,
  CREATED_AT: /\d{1,2}\/\d{1,2}\/\d{4}/,
  GENDER_REGEX: /Giới tính \/ Sex[:.]?\s*(Nam|Nữ)/,
  NATIONAL_REGEX: /Quốc tịch [\/|] Nationality[:.,]?\s*(Việt Nam)/,
  ADDRESS_REGEX: /Nơi thường trú (?:I|\/) Place of residence[:.]?\s*([\d\/\s\p{L}]+)\s*\n\s*([\p{L}\s,.\d]+)|Noi thường trú (?:I|\/) Place of residence[:.]?\s*([\d\/\s\p{L}]+)\s*\n\s*([\p{L}\s,.\d]+)/u
};

module.exports = {
  CommonConstant
};
