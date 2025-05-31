tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      }
    },
    fontFamily: {
      "body": [
    "Inter",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "system-ui",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Noto Sans",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji"
  ],
      "sans": [
    "Inter",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "system-ui",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "Noto Sans",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji"
  ]
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const currentPath = window.location.pathname;

  const dropdownConfig = {
    "/admin/analysis_documents": "dropdown-documents",
    "/admin/document_export_hitories": "dropdown-documents",
    "/admin/remove_background": "dropdown-documents",
    "/admin/customers": "dropdown-customers",
    "/admin/customers/new": "dropdown-customers",
    "/admin/employees": "dropdown-employees",
    "/admin/employees/new": "dropdown-employees",
    "/admin/employees/task/new": "dropdown-employees",
    "/admin/collaborators": "dropdown-collaborators",
    "/admin/collaborators/new": "dropdown-collaborators",
    "/admin/collaborators/customers": "dropdown-collaborators",
    "/admin/tours": "dropdown-tours",
    "/admin/revenues": "dropdown-tours",
    "/employees/edit": "dropdown-employees",
    "/collaborators/edit": "dropdown-collaborators",
    "/tours": "dropdown-tours",
    "/tours/completed_bookings": "dropdown-tours",
  };

  const dynamicPath = [
    {prefix: "/admin/customers/edit/", dropdown: "dropdown-customers"},
    {prefix: "/admin/employees/edit/", dropdown: "dropdown-employees"},
    {prefix: "/admin/collaborators/edit/", dropdown: "dropdown-collaborators"},
    {prefix: "/admin/tours", dropdown: "dropdown-tours"},
    {prefix: "/tours", dropdown: "dropdown-tours"},
  ];

  for (const {prefix, dropdown} of dynamicPath) {
    if (currentPath.startsWith(prefix)) {
      dropdownConfig[currentPath] = dropdown;
      break;
    }
  }

  if (dropdownConfig[currentPath]) {
    const dropdown = document.getElementById(dropdownConfig[currentPath]);
    if (dropdown) {
      dropdown.classList.remove("hidden");
      dropdown.previousElementSibling.setAttribute("aria-expanded", "true");

      dropdown.querySelectorAll("a").forEach(link => {
        if (link.getAttribute("href") === currentPath) {
          link.classList.add("active-link");
        }
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const dateInputs = document.querySelectorAll(".datepicker");
  if (dateInputs.length) {
    dateInputs.forEach(input => {
      flatpickr(input, {
        dateFormat: "d-m-Y",
        altInput: true,
        altFormat: "d-m-Y",
        allowInput: true
      });
    });
  }
});
