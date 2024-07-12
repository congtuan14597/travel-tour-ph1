## How to run project on

### Install dependecies
```
$ npm install
$ npm run dev
```

### Call api
```
POST http://localhost:3000/api/v1/files/perform_analysis

BODY form-data
{
  file: file,
  question: question
}
```

```
CURL
curl --location --request POST 'http://localhost:3000/api/v1/files/perform_analysis' \
--form 'file=@"/Users/congtuan14597/Downloads/IMAGE/CCCD.jpeg"' \
--form 'question="bạn có thể vui lòng cung cấp giúp tôi các thông tin được không"'
```

### Result export file output.txt
```
Họ và tên / Full name: **LÊ CÔNG TUẤN**
Số / No: **045097005263**
Ngày sinh / Date of birth: **14/05/1997**
Quê quán / Place of origin: **Triệu An, Triệu Phong, Quảng Trị**
Giới tính / Sex: **Nam**
Quốc tịch / Nationality: **Việt Nam**
Nơi thường trú / Place of residence: **Triệu An, Triệu Phong, Quảng Trị, Tường Vạn**
Cơ quan cấp / Issuing Authority: **14/05/2037**
```
