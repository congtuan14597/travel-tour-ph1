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

  if (currentPath === "/admin/analysis_documents" ||
    currentPath === "/admin/document_export_hitories" ||
    currentPath === "/admin/analysis_images") {
    const dropdownRoom = document.getElementById("dropdown-documents");
    dropdownRoom.classList.remove("hidden");
    dropdownRoom.previousElementSibling.setAttribute("aria-expanded", "true");

    const links = dropdownRoom.querySelectorAll("a");
    links.forEach(link => {
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active-link");
      }
    });
  }
});
