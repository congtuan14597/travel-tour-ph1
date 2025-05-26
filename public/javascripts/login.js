const isAdminPage = window.location.pathname.startsWith("/admin");
const loginUrl = isAdminPage ? "/admin/login" : "/login";
let redirectUrl = isAdminPage ? "/admin/analysis_documents" : "/employees/edit";
const formId = isAdminPage ? "#login-form" : "#user-login-form";

if ($(formId)) {
  $(formId).on("submit", function(e) {
    e.preventDefault();

    const email = $("#email").val();
    const password = $("#password").val();

    $.ajax({
      url: loginUrl,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function(data) {
        if (data.success) {
          Toastify({
            text: "Đăng nhập thành công!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          }).showToast();

          if (data.user.role === "2") {
            redirectUrl = "/collaborators/edit";
          }

          setTimeout(function() {
            window.location.assign(redirectUrl);
          }, 500);
        } else {
          Toastify({
            text: data.message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          }).showToast();
        }
      },
      error: function(error) {
        console.error("Error:", error);
        Toastify({
          text: "Đã xảy ra lỗi, vui lòng thử lại.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }).showToast();
      }
    });
  });
}
