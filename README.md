## How to run project on

### Install dependecies
```
$ npm install
$ npm run dev
```

### Call api
```
POST http://localhost:3000/admin/api/v1/files/perform_analysis

BODY form-data
{
  files: file,
  files: file
}
```

```
CURL
curl --location --request POST 'http://localhost:3000/admin/api/v1/files/perform_analysis' \
--form 'files=@"/Users/congtuan14597/Documents/PROJECT/TRAVEL_TOUR/PHASE1/DATA/25.7/1 LỘC LINH THẢO--LINH ZALO (1).jpg"' \
--form 'files=@"/Users/congtuan14597/Documents/PROJECT/TRAVEL_TOUR/PHASE1/DATA/25.7/1 LỘC LINH THẢO--LINH ZALO (3).jpg"'
```

### Result export file output.txt
```
extractedInfo {
  cardID: '020193006515',
  fullName: 'lộc linh thảo',
  dayOfBirth: '15/04/1993',
  gender: 'Nữ',
  national: 'Việt Nam',
  address: 'Thị trấn Lộc Bình, Lộc Bình, Lạng Sơn',
  village: 'khu lao động',
  createdAt: '6/08/2021',
  province: 'Lạng Sơn',
  district: 'Lộc Bình',
  commune: 'Thị trấn Lộc Bình',
  provinceCode: '209',
  districtCode: '20915',
  communeCode: '2091545'
}
```
