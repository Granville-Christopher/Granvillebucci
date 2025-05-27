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

const testimonyForm = document.getElementById("testimonyForm");
if (testimonyForm) {
  testimonyForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    formData.append("image", form["testimonial-image"].files[0]);
    formData.append("point", form["testimonial-point"].value);
    formData.append("description", form["testimonial-description"].value);
    formData.append("name", form["testimonial-name"].value);

    try {
      if (!form["testimonial-image"].files[0]) {
        showAlert("Please select an image.", "error");
        return;
      }

      const res = await fetch("/testimony", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Testimony submitted successfully!", "success");
        form.reset();
      } else {
        showAlert(
          "Error: " + (data.message || "Something went wrong on the server."),
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      showAlert("Network error. Please try again later.", "error");
    }
  });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;

    const formData = {
      firstname: form.elements["firstname"].value,
      lastname: form.elements["lastname"].value,
      email: form.elements["email"].value,
      phone: form.elements["phone"].value,
      message: form.elements["message"].value,
    };

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      showAlert("Please fill in all fields.", "error");
      return;
    }

    try {
      const res = await fetch("/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Message sent successfully!", "success");
        form.reset();
      } else {
        showAlert(
          "Error: " + (data.message || "Something went wrong on the server."),
          "error"
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      showAlert("Network error. Please try again later.", "error");
    }
  });
}
