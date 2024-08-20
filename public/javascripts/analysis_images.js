document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("fileInput").addEventListener("change", async function(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const loadingBar = document.getElementById("loadingBar");
      const loadingBarInner = loadingBar.querySelector("div");
      loadingBar.classList.remove("hidden");
      loadingBarInner.style.width = "50%";

      const formData = new FormData();
      for (const file of files) {
        formData.append("image_files", file);
      }

      try {
        const response = await fetch("/admin/process-images", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const zipFileURL = result.zipFilePath;
          console.log("Zip file URL:", zipFileURL);

          loadingBarInner.style.width = "100%";

          const downloadButton = document.getElementById("downloadButton");
          downloadButton.classList.remove("hidden");
          downloadButton.href = zipFileURL;
          downloadButton.textContent = "Tải xuống ZIP";
        } else {
          document.getElementById("downloadButton").classList.add("hidden");
          console.error("Failed to process images.");
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("downloadButton").classList.add("hidden");
      }

      loadingBar.classList.add("hidden");
      loadingBarInner.style.width = "0";
    }
  });
});
