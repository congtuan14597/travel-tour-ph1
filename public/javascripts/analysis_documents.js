document.addEventListener("DOMContentLoaded", function() {
  document.querySelector(".add-new-user").addEventListener("click", function() {
    const userGroup = document.getElementById("extract-user-group");
    const userTemplate = document.querySelector(".extract-user-item").cloneNode(true);
    userTemplate.querySelector('input[name="frontImage"]').value = '';
    userTemplate.querySelector('input[name="backImage"]').value = '';
    userTemplate.querySelector('input[name="cardID"]').value = '';
    userTemplate.querySelector('input[name="fullName"]').value = '';
    userTemplate.querySelector('input[name="birthDate"]').value = '';
    userTemplate.querySelector('select[name="gender"]').value = 'male';
    userTemplate.querySelector('input[name="address"]').value = '';
    userTemplate.querySelector('input[name="createdAt"]').value = '';

    const userInfo = userTemplate.querySelector(".user-infor");
    if (!userInfo.classList.contains("hidden")) {
      userInfo.classList.add("hidden");
    }

    const errorMessageInfo = userTemplate.querySelector(".error-message");
    errorMessageInfo.innerHTML = "";
    if (!errorMessageInfo.classList.contains("hidden")) {
      errorMessageInfo.classList.add("hidden");
    }

    const hrElement = document.createElement("hr");
    hrElement.className = "border-t border-gray-300 my-4 mt-8";

    userGroup.appendChild(hrElement);
    userGroup.appendChild(userTemplate);
  });

  document.querySelector(".reset-form-analysis-file").addEventListener("click", function() {
    document.querySelector('input[name="fileName"]').value = "";
    const errorWithoutApi = document.querySelector(".error-form-without-execute-api");
    if (!errorWithoutApi.classList.contains("hidden")) {
      errorWithoutApi.classList.add("hidden");
    }
    const errorWithApi = document.querySelector(".error-message-group");
    if (!errorWithApi.classList.contains("hidden")) {
      errorWithApi.classList.add("hidden");
    }
    const successMessage = document.querySelector(".success-message");
    if (!successMessage.classList.contains("hidden")) {
      successMessage.classList.add("hidden");
    }
    document.querySelectorAll('input[name="frontImage"]').forEach(element => {
      element.value = "";
    });
    document.querySelectorAll('input[name="backImage"]').forEach(element => {
      element.value = "";
    });
    document.querySelectorAll('input[name="cardID"]').forEach(element => {
      element.value = "";
    });
    document.querySelectorAll('input[name="fullName"]').forEach(element => {
      element.value = "";
    });
    document.querySelectorAll('input[name="birthDate"]').forEach(element => {
      element.value = "";
    });
    document.querySelectorAll('select[name="gender"]').value = 'male';
    document.querySelectorAll('input[name="address"]').forEach(element => {
      element.value = "";
    });
    document.querySelectorAll('input[name="createdAt"]').forEach(element => {
      element.value = "";
    });
  });

  document.getElementById("analysis-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const btnSubmit = document.querySelector(".btn-submit-perform-file");
    if (!btnSubmit.classList.contains("cursor-not-allowed")) {
      btnSubmit.classList.add("cursor-not-allowed");
    }
    const formData = new FormData();
    const fileName = document.querySelector('input[name="fileName"]').value;
    const customerContainers = document.querySelectorAll("#extract-user-group .extract-user-item");

    formData.append("fileName", fileName);
    customerContainers.forEach((customer, index) => {
      const frontImage = customer.querySelector('input[name="frontImage"]').files[0];
      const backImage = customer.querySelector('input[name="backImage"]').files[0];
      const cardID = customer.querySelector('input[name="cardID"]').value;
      const fullName = customer.querySelector('input[name="fullName"]').value;
      const birthDate = customer.querySelector('input[name="birthDate"]').value;
      const gender = customer.querySelector('select[name="gender"]').value;
      const address = customer.querySelector('input[name="address"]').value;
      const createdAt = customer.querySelector('input[name="createdAt"]').value;

      formData.append(`user${index + 1}[frontImage]`, frontImage);
      formData.append(`user${index + 1}[backImage]`, backImage);
      formData.append(`user${index + 1}[cardID]`, cardID);
      formData.append(`user${index + 1}[fullName]`, fullName);
      formData.append(`user${index + 1}[birthDate]`, birthDate);
      formData.append(`user${index + 1}[gender]`, gender);
      formData.append(`user${index + 1}[address]`, address);
      formData.append(`user${index + 1}[createdAt]`, createdAt);
    });

    fetch("api/v1/files/perform_analysis", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      if (btnSubmit.classList.contains("cursor-not-allowed")) {
        btnSubmit.classList.remove("cursor-not-allowed");
      }

      const errorMessageForm = document.querySelector(".error-form-without-execute-api");
      const successMessage = document.querySelector(".success-message");

      if (!data.success) {
        if (!successMessage.classList.contains("hidden")) {
          successMessage.classList.add("hidden");
        }

        if (data.isValidateRequired) {
          const errorMessageWithoutExecuteApi = document.querySelector(".error-message-without-execute-api");
          errorMessageWithoutExecuteApi.innerHTML = data.errors.map(error => error.message).join("<br>")

          if (errorMessageForm.classList.contains("hidden")) {
            errorMessageForm.classList.remove("hidden");
          }
        } else {
          if (!errorMessageForm.classList.contains("hidden")) {
            errorMessageForm.classList.add("hidden");
          }
          document.querySelectorAll(".user-infor").forEach(element => {
            element.classList.add("hidden");
          });

          data.errors.forEach(error => {
            const customer = customerContainers[error.index - 1];
            const errorMessage = customer.querySelector(".error-message");
            const infoForm = customer.querySelector(".user-infor");
            errorMessage.innerHTML = error.message;
            errorMessage.classList.remove("hidden");
            infoForm.classList.remove("hidden");
          });
        }
      } else {
        if (!errorMessageForm.classList.contains("hidden")) {
          errorMessageForm.classList.add("hidden");
        }
        document.querySelectorAll(".user-infor").forEach(element => {
          element.classList.add("hidden");
        });

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
  });
});
