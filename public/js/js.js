const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
const closeIcon = document.getElementById("close-icon");

if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");

    mobileMenu.classList.toggle("hidden");

    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const testimonials = document.querySelectorAll(".testimonial-item");
  const prevButton = document.getElementById("prev-testimonial");
  const nextButton = document.getElementById("next-testimonial");
  const dotsContainer = document.getElementById("testimonial-dots");
  let currentIndex = 0;
  let autoSlideInterval;

  // Function to show a specific testimonial
  function showTestimonial(index) {
    // Ensure index wraps around
    currentIndex = (index + testimonials.length) % testimonials.length;

    // Hide all testimonials and remove active classes
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.remove("opacity-100", "z-10");
      testimonial.classList.add("opacity-0", "z-0");
      // Ensure all testimonials are positioned absolutely to allow overlap during fade
      testimonial.style.position = "absolute";
      testimonial.style.top = "0";
      testimonial.style.left = "0";
      testimonial.style.width = "100%";
      testimonial.style.visibility = "hidden"; // Hide visually but keep in flow for height
    });

    const current = testimonials[currentIndex];
    if (!current) return;

    // Show the current testimonial
    testimonials[currentIndex].classList.remove("opacity-0", "z-0");
    testimonials[currentIndex].classList.add("opacity-100", "z-10");
    testimonials[currentIndex].style.visibility = "visible"; // Make visible

    if (typeof updateDots === "function") updateDots();
  }

  // Function to go to the next testimonial
  function nextTestimonial() {
    showTestimonial(currentIndex + 1);
  }

  // Function to go to the previous testimonial
  function prevTestimonial() {
    showTestimonial(currentIndex - 1);
  }

  // Function to create and update navigation dots
  function updateDots() {
    dotsContainer.innerHTML = ""; // Clear existing dots
    testimonials.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add(
        "w-3",
        "h-3",
        "rounded-full",
        "bg-gray-300",
        "hover:bg-blue-400",
        "transition-colors",
        "duration-300"
      );
      if (i === currentIndex) {
        dot.classList.remove("bg-gray-300");
        dot.classList.add("bg-blue-600");
      }
      dot.addEventListener("click", () => {
        showTestimonial(i);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Auto-slide functionality
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Event Listeners for navigation buttons
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      prevTestimonial();
      resetAutoSlide();
    });
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextTestimonial();
      resetAutoSlide();
    });
  }

  // Initial display and auto-slide start
  showTestimonial(currentIndex);
  startAutoSlide();

  // Adjust height of the carousel container dynamically

  const adjustCarouselHeight = () => {
    let maxHeight = 0;
    testimonials.forEach((item) => {
      // Temporarily make visible and in flow to measure height
      item.style.position = "relative"; // Temporarily make relative to be in flow
      item.style.visibility = "hidden"; // Hide visually
      item.style.display = "block"; // Ensure it takes up space
      maxHeight = Math.max(maxHeight, item.offsetHeight);
      // Reset to absolute and hidden after measurement
      item.style.position = "absolute";
      item.style.visibility = "hidden";
      item.style.display = "block"; // Keep display block for absolute positioning
    });
    const carousel = document.getElementById("testimonials-carousel");
    if (carousel) {
      carousel.style.height = `${maxHeight}px`;
    }

    // Re-show the current testimonial after height adjustment
    showTestimonial(currentIndex);
  };

  // Run on load and resize
  window.addEventListener("load", adjustCarouselHeight);
  window.addEventListener("resize", adjustCarouselHeight);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.error("SW registration failed:", err));
  });
}

// Optional smooth scroll offset with JS
document.querySelectorAll('a[href^="/#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href").split("#")[1];
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 96; // adjust to match navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  });
});

