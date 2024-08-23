document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("analysis-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const errorMessageForm = document.querySelector(".error-form-without-execute-api");
    const errorMessageWithoutExecuteApi = document.querySelector(".error-message-without-execute-api");
    const btnSubmit = document.querySelector(".btn-submit-perform-file");
    if (!btnSubmit.classList.contains("cursor-not-allowed")) {
      btnSubmit.classList.add("cursor-not-allowed");
      document.querySelector(".icon-loading").classList.remove("hidden");
    }

    let users = [];
    const frontFiles = document.querySelector(".front-cccd-image").files;
    const qrVNeIDFiles = document.querySelector(".qr-vneid-image").files;
    const allFiles = [...frontFiles, ...qrVNeIDFiles];

    if (allFiles.length === 0) {
      errorMessageWithoutExecuteApi.innerHTML = "VUI LÒNG CHỌN FILE.";
      if (errorMessageForm.classList.contains("hidden")) {
        errorMessageForm.classList.remove("hidden");
      }
      if (btnSubmit.classList.contains("cursor-not-allowed")) {
        btnSubmit.classList.remove("cursor-not-allowed");
        document.querySelector(".icon-loading").classList.add("hidden");
      }

      return;
    }

    const promises = [];
    for (let i = 0; i < allFiles.length; i++) {
      let file = allFiles[i];
      let promise = QrScanner.scanImage(file, { returnDetailedScanResult: true })
        .then(result => {
          const data = result.data;
          if (!data) {
            errorMessageWithoutExecuteApi.innerHTML = `${file.name} KHÔNG HỢP LỆ, VUI LÒNG CHỌN ẢNH CÓ CHẤT LƯỢNG TỐT HƠN.`;
            if (errorMessageForm.classList.contains("hidden")) {
              errorMessageForm.classList.remove("hidden");
            }
            if (btnSubmit.classList.contains("cursor-not-allowed")) {
              btnSubmit.classList.remove("cursor-not-allowed");
              document.querySelector(".icon-loading").classList.add("hidden");
            }
          }

          const fields = data.split("|");
          const cardID = fields[0];
          const fullName = fields[2];
          const dayOfBirth = fields[3];
          const dayOfBirthWithFormat = `${dayOfBirth.slice(0, 2)}/${dayOfBirth.slice(2, 4)}/${dayOfBirth.slice(4, 8)}`;
          const gender = fields[4];
          const fullAddress = fields[5];
          const fullAddressArray = fullAddress.split(",").reverse();
          const provinceName = fullAddressArray[0];
          const districtName = fullAddressArray[1];
          const communeName = fullAddressArray[2];
          const villageName = fullAddressArray[3];
          const createdAt = fields[6];
          const createdAtWithFormat = `${createdAt.slice(0, 2)}/${createdAt.slice(2, 4)}/${createdAt.slice(4, 8)}`;

          const user = {
            cardID: cardID,
            fullName: fullName,
            dayOfBirth: dayOfBirthWithFormat,
            gender: gender,
            genderCode: gender === "Name" ? "M" : "F",
            provinceName: provinceName.trimStart(),
            districtName: districtName.trimStart(),
            communeName: communeName.trimStart(),
            villageName: villageName.trimStart(),
            createdAt: createdAtWithFormat
          };

          debugger
          users.push(user);
        })
        .catch(e => {
          errorMessageWithoutExecuteApi.innerHTML = `${file.name} KHÔNG HỢP LỆ, VUI LÒNG CHỌN ẢNH CÓ CHẤT LƯỢNG TỐT HƠN.`;
          if (errorMessageForm.classList.contains("hidden")) {
            errorMessageForm.classList.remove("hidden");
          }
          if (btnSubmit.classList.contains("cursor-not-allowed")) {
            btnSubmit.classList.remove("cursor-not-allowed");
            document.querySelector(".icon-loading").classList.add("hidden");
          }
        });

      promises.push(promise);
    }

    const fileName = document.querySelector(".analysis-file-name").value
    Promise.all(promises).then(() => {
      if (users.length !== 0) {
        fetch("api/v1/files/perform_analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            file_name: fileName,
            users: users
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);

          if (btnSubmit.classList.contains("cursor-not-allowed")) {
            btnSubmit.classList.remove("cursor-not-allowed");
            document.querySelector(".icon-loading").classList.add("hidden");
          }

          const successMessage = document.querySelector(".success-message");

          if (!data.success) {
            if (!successMessage.classList.contains("hidden")) {
              successMessage.classList.add("hidden");
            }

            if (data.isValidateRequired) {
              errorMessageWithoutExecuteApi.innerHTML = data.errors.map(error => error.message).join("<br>")
              if (errorMessageForm.classList.contains("hidden")) {
                errorMessageForm.classList.remove("hidden");
              }
            } else {
              if (!errorMessageForm.classList.contains("hidden")) {
                errorMessageForm.classList.add("hidden");
              }
              data.errors.forEach(error => {
                const customer = customerContainers[error.index - 1];
                const errorMessage = customer.querySelector(".error-message");
                errorMessage.innerHTML = error.message;
                errorMessage.classList.remove("hidden");
              });
            }
          } else {
            if (!errorMessageForm.classList.contains("hidden")) {
              errorMessageForm.classList.add("hidden");
            }
            if (successMessage.classList.contains("hidden")) {
              successMessage.classList.remove("hidden");
            }
            successMessage.innerHTML = data.message;
          }

          window.scroll({ top: 0, behavior: "smooth" });
        })
        .catch(error => {
          console.error("Error:", error);
        });
      }
    });
  });
});
