// alert modal
const customAlertModal = document.getElementById("customAlertModal");
const customAlertMessage = document.getElementById("customAlertMessage");
const customAlertCloseButton = document.getElementById(
  "customAlertCloseButton"
);
function showAlert(message, type = "info") {
  customAlertMessage.textContent = message;

  if (type === "success") {
    customAlertMessage.classList.remove("text-red-700");
    customAlertMessage.classList.add("text-green-700");
  } else if (type === "error") {
    customAlertMessage.classList.remove("text-green-700");
    customAlertMessage.classList.add("text-red-700");
  } else {
    customAlertMessage.classList.remove("text-green-700", "text-red-700");
    customAlertMessage.classList.add("text-gray-800");
  }
  customAlertModal.classList.remove("hidden");
}

function hideAlert() {
  customAlertModal.classList.add("hidden");
}

if (customAlertCloseButton) {
  customAlertCloseButton.addEventListener("click", hideAlert);
}

// delete confirmation modal
const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

// contact ajax form validation and submission
const contactForm = document.getElementById("adminContactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    const payload = {
      officeLocation: form["officeLocation"].value,
      emailAddress: form["emailAddress"].value,
      phoneNumber: form["phoneNumber"].value,
      otherInfo: form["otherInfo"].value,
    };

    try {
      const res = await fetch("/admin/adminContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Contact details sent successfully!", "success");
        form.reset();
      } else {
        showAlert(
          data.message || "Something went wrong. Please try again.",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong. Please try again.", "error");
    }
  });
}

const portfolio = document.getElementById("portfolio");

if (portfolio) {
  portfolio.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch("/admin/portfolio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Project added successfully!", "success");
        form.reset();
      } else {
        showAlert(data.message || "Failed to add project", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong. Please try again.", "error");
    }
  });
}



































// delete api
// deletecontact
const deleteContactInfo = document.getElementById("delete-contact-info-button");

if (deleteContactInfo) {
  deleteContactInfo.addEventListener("click", () => {
    confirmModal.classList.remove("hidden");
  });
}

cancelDeleteBtn.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

confirmDeleteBtn.addEventListener("click", async () => {
  confirmModal.classList.add("hidden");

  try {
    const res = await fetch("/admin/adminContact/delete", {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      showAlert("Contact info deleted successfully", "success");
      location.reload();
    } else {
      showAlert(data.message || "Failed to delete contact info", "error");
    }
  } catch (err) {
    console.error(err);
    showAlert("Something went wrong. Please try again.", "error");
  }
});
