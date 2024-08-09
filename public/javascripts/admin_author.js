document.addEventListener('DOMContentLoaded', function () {
    if (!sessionStorage.getItem('adminAuthentication')) {
    window.location.assign('/admin/login');
    return;
    }
});