if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Toastify({
          text: 'Đăng nhập thành công!',
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        setTimeout(() => {
          window.location.assign('/admin/analysis_documents');
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
    })
    .catch(error => {
      console.error('Error:', error);
      Toastify({
      text: 'Đã xảy ra lỗi, vui lòng thử lại.',
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    });
  });
}

if ($("#user-login-form")) {
  $("#user-login-form").on("submit", function(e) {
    e.preventDefault();

    const email = $("#email").val();
    const password = $("#password").val();

    $.ajax({
      url: "/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function(data) {
        if (data.success) {
          Toastify({
            text: 'Đăng nhập thành công!',
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          }).showToast();

          setTimeout(function() {
            window.location.assign("/employees");
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
        console.error('Error:', error);
        Toastify({
          text: 'Đã xảy ra lỗi, vui lòng thử lại.',
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
