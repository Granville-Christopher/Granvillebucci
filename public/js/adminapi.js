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
const confirmBlogModal = document.getElementById("confirmBlogModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmBlogDeleteBtn = document.getElementById("confirmBlogDeleteBtn");
const cancelBlogDeleteBtn = document.getElementById("cancelBlogDeleteBtn");

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

const signup = document.getElementById("signup");

if (signup) {
  signup.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-])[A-Za-z\d.!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{8,}$/;

    if (!passwordPattern.test(password)) {
      showAlert(
        "Password must contain uppercase, lowercase, number, special character, and be at least 8 characters.",
        "error"
      );
      return;
    }

    try {
      const res = await fetch("/admin/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Sign up successful!", "success");
        form.reset();
        setTimeout(() => {
          window.location.href = "/admin/admin"; // Redirect after short delay
        }, 1500);
      } else {
        showAlert(data.error || "Signup failed. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong. Please try again.", "error");
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
      showAlert("Form inputs not found. Please check HTML IDs.", "error");
      console.error("Login form email or password input not found.");
      return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const res = await fetch("/admin/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Login successful", "success");
        setTimeout(() => {
          window.location.href = "/admin/admin";
        }, 1500);
      } else {
        showAlert(data.error || "Login failed", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert("Something went wrong. Please try again.", "error");
    }
  });
}

const blogForm = document.getElementById("blogForm");

if (blogForm) {
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = blogForm.blogTitle.value.trim();
    const quote = blogForm.blogQuote ? blogForm.blogQuote.value.trim() : ""; // optional field
    const content = blogForm.blogContent.value.trim();
    const image = blogForm.blogImage.files[0];
    const isFeatured = blogForm.isFeatured.checked;

    // Get multiple selected categories from the select with id="categories"
    const categoryElement = document.getElementById("categories");
    const category = categoryElement
      ? Array.from(categoryElement.selectedOptions).map((opt) => opt.value)
      : [];

    // Validations
    if (!title || category.length === 0 || !content || !image) {
      showAlert("Please fill in all fields and upload an image.", "error");
      return;
    }

    if (content.length < 50) {
      showAlert("Blog content must be at least 50 characters.", "error");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      showAlert("Only JPEG, JPG, PNG, or WEBP images are allowed.", "error");
      return;
    }

    // Format content with paragraph breaks
    const formattedContent = formatContentWithParagraphs(content, 200);

    const formData = new FormData();
    formData.append("blogTitle", title);
    formData.append("blogQuote", quote);
    formData.append("blogContent", formattedContent);
    formData.append("blogImage", image);
    formData.append("isFeatured", isFeatured);

    category.forEach((cat) => formData.append("category", cat));

    try {
      const res = await fetch("/admin/api/blogs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Blog published successfully!", "success");
        setTimeout(() => {
          window.location.href = "/admin/admin-blogs";
        }, 1500);
      } else {
        showAlert(data.error || "Failed to publish blog.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong. Please try again.", "error");
    }
  });
}

// Helper function to split content into paragraphs
function formatContentWithParagraphs(text, wordsPerParagraph = 200) {
  const words = text.split(/\s+/);
  const paragraphs = [];

  for (let i = 0; i < words.length; i += wordsPerParagraph) {
    const chunk = words.slice(i, i + wordsPerParagraph).join(" ");
    paragraphs.push(`<p>${chunk}</p>`);
  }

  return paragraphs.join("\n\n");
}

const editBlogForm = document.getElementById("editBlogForm");
if (editBlogForm) {
  editBlogForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    formData.set("isFeatured", form.elements["isFeatured"].checked);

    const blogId = window.location.pathname.split("/").pop();

    try {
      const res = await fetch(`/admin/blogs/${blogId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Blog post updated successfully!", "success");
        setTimeout(() => {
          window.location.href = "/admin/admin-blogs";
        }, 1500);
      } else {
        showAlert(
          "Error: " + (data.message || "Failed to update blog post."),
          "error"
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      showAlert("Network error. Please try again later.", "error");
    }
  });
}

let currentBlogIdToDelete = null;

if (cancelBlogDeleteBtn) {
  cancelBlogDeleteBtn.addEventListener("click", () => {
    if (confirmBlogModal) confirmBlogModal.classList.add("hidden");
    currentBlogIdToDelete = null;
  });
}

if (confirmBlogDeleteBtn) {
  confirmBlogDeleteBtn.addEventListener("click", async () => {
    if (confirmBlogModal) confirmBlogModal.classList.add("hidden");

    if (!currentBlogIdToDelete) {
      showAlert("Error: No blog post selected for deletion.", "error");
      return;
    }

    try {
      const res = await fetch(`/admin/blogs/${currentBlogIdToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Blog post deleted successfully!", "success");
        const deletedItem = document
          .querySelector(
            `form[action*="/admin/deleteblog/${currentBlogIdToDelete}"]`
          )
          .closest("li");
        if (deletedItem) {
          deletedItem.remove();
        }
        const blogListContainer = document.querySelector(
          ".bg-white.rounded-xl.shadow.p-6"
        );
        const ul = blogListContainer
          ? blogListContainer.querySelector("ul")
          : null;
        if (ul && ul.children.length === 0) {
          blogListContainer.innerHTML =
            '<p class="text-gray-500 text-center">No blog posts have been added yet.</p>';
        }
      } else {
        showAlert(
          "Error: " + (data.message || "Failed to delete blog post."),
          "error"
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      showAlert("Network error. Please try again later.", "error");
    } finally {
      currentBlogIdToDelete = null;
    }
  });
}
const blogListContainer = document.querySelector(
  ".bg-white.rounded-xl.shadow.p-6"
);

if (blogListContainer) {
  blogListContainer.addEventListener("click", async (e) => {
    const deleteButton = e.target.closest('button[type="submit"].bg-red-500');
    const deleteForm = e.target.closest('form[action*="/admin/deleteblog/"]');

    if (deleteButton && deleteForm) {
      e.preventDefault();

      currentBlogIdToDelete = deleteForm.action.split("/").pop();

      if (confirmBlogModal) {
        confirmBlogModal.classList.remove("hidden");
      } else {
        const confirmBlogDelete = showAlert(
          "Are you sure you want to delete this blog post? This action cannot be undone."
        );
        if (confirmBlogDelete) {
          showAlert("Blog deleted successfully", "success");
          confirmBlogDeleteBtn.click();
        } else {
          currentBlogIdToDelete = null;
        }
      }
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

// password reset hooks
document.getElementById("getOtpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("forgot-email").value;

  try {
    const res = await fetch("/admin/get-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    showAlert(data.message || data.error, res.ok ? "success" : "error");
  } catch (err) {
    showAlert("Failed to send OTP", "error");
  }
});


document
  .getElementById("resetPasswordForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reset-email").value;
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById(
      "confirm-new-password"
    ).value;

    try {
      const res = await fetch("/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmNewPassword }),
      });

      const data = await res.json();

      showAlert(data.message || data.error, res.ok ? "success" : "error");

      if (res.ok) {
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1500);
      }

    } catch (err) {
      showAlert("Failed to reset password", "error");
    }
  });

