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

      // sessionStorage.setItem('adminAuthentication', data.token);

      setTimeout(() => {
          window.location.assign('/admin/analysis_documents');
      }, 3000);
    } else {
      Toastify({
          text: data.message,
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
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