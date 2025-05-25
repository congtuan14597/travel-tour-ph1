document.addEventListener('click', function (event) {
  var dropdownMenu = document.getElementById('dropdownMenu');
  var avatarButton = document.getElementById('avatarButton');

  // Kiểm tra nếu click bên ngoài avatar hoặc dropdown menu
  if (!avatarButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add('hidden');
  }
});

document.getElementById('avatarButton').addEventListener('click', function () {
  var dropdownMenu = document.getElementById('dropdownMenu');
  dropdownMenu.classList.toggle('hidden');
});

document.getElementById('logoutButton').addEventListener('click', function (event) {
  event.preventDefault();

  // Kiểm tra xem đang ở trang admin hay user
  const isAdminPage = window.location.pathname.startsWith('/admin');
  const logoutUrl = isAdminPage ? '/admin/logout' : '/logout';
  const redirectUrl = isAdminPage ? '/admin/login' : '/login';

  // Gọi API logout
  fetch(logoutUrl, {
    method: 'POST',
    credentials: 'include'
  }).then(response => {
    if (response.ok) {
      response.json().then(data => {
        if (data.success) {
          window.location.href = redirectUrl;
        } else {
          console.error('Logout unsuccessful:', data.message);
        }
      });
    } else {
      console.error('Network response was not ok:', response.statusText);
    }
  }).catch(error => {
    console.error('Logout failed:', error);
  });
});

let isTabClosing = false;

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    isTabClosing = true;
  } else {
    isTabClosing = false;
  }
});

window.addEventListener('beforeunload', function(event) {
  if (isTabClosing) {
    const isAdminPage = window.location.pathname.startsWith('/admin');
    const logoutUrl = isAdminPage ? '/admin/logout' : '/logout';
    navigator.sendBeacon(logoutUrl);
  }
});
