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

  // Gọi API logout
  fetch('/admin/logout', {
    method: 'POST',
    credentials: 'include'
  }).then(response => {
    if (response.ok) {
      window.location.href = '/admin/login';
    }
  }).catch(error => {
    console.error('Logout failed:', error);
  });
});

window.addEventListener('beforeunload', function (event) {
  navigator.sendBeacon('/admin/logout');
});
