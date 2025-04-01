$(function () {
  // Kiểm tra và disable nút Export nếu không có dữ liệu
  function checkExportBtn() {
    let searchValue = $("#search-customers").length > 0
      ? $("#search-customers").val().trim()
      : "";
    let rowCount = $("tbody tr").length;

    if (!searchValue && rowCount == 0) {
      $("#exportBtn").prop("disabled", true);
    } else {
      $("#exportBtn").prop("disabled", false);
    }
  };

  checkExportBtn();

  $("#search-customers").on("input", function() {
    checkExportBtn();
  });

  $("#exportBtn").on("click", function() {
    let customers = [];

    $("tbody tr").each(function() {
      let documentNumber = $(this).find("td:nth-child(1)").text().trim();
      let cardID = $(this).find("td:nth-child(2)").text().trim();
      let fullName = $(this).find("td:nth-child(3)").text().trim();
      let dayOfBirth = $(this).find("td:nth-child(4)").text().trim();
      let gender = $(this).find("td:nth-child(5)").text().trim();
      let genderCode = gender === "Nam" ? "M" : "F";
      let national = $(this).find("td:nth-child(6)").text().trim();
      let address = $(this).find("td:nth-child(7)").text().trim();
      let createdAt = $(this).find("td:nth-child(8)").text().trim();
      let village = $(this).find("td:nth-child(9)").text().trim();
      let provinceName = $(this).find("td:nth-child(10)").text().trim();
      let districtName = $(this).find("td:nth-child(11)").text().trim();
      let communeName = $(this).find("td:nth-child(12)").text().trim();
      let provinceCode = $(this).find("td:nth-child(13)").text().trim();
      let districtCode = $(this).find("td:nth-child(14)").text().trim();
      let communeCode = $(this).find("td:nth-child(15)").text().trim();

      customers.push({
        documentNumber, cardID, fullName, dayOfBirth, gender, genderCode,
        provinceName, districtName, communeName, village, createdAt,
        provinceCode, districtCode, communeCode
      })
    });

    if (customers.length === 0) {
      alert("Không có dữ liệu để download!");
      return;
    }

    let file_name = customers[0].documentNumber || "customers";

    $.ajax({
      url: "/admin/api/v1/files/perform_analysis",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        file_name: file_name,
        users: customers
      }),
      dataType: "json",
      success: function () {
        Toastify({
          text: `Đã trích xuất tài liệu thành công.
          Vui lòng truy cập trang Lịch sử trích xuất
          để tải về các tài liệu bạn cần.`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          className: "custom-toast",
        }).showToast();
      },
      error: function () {
        Toastify({
          text: `Đã có lỗi xảy ra trong quá trình trích xuất.`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }).showToast();
      },
    });
  });
});
