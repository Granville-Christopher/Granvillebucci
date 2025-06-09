gsap.registerPlugin(ScrollTrigger, Flip);

gsap.defaults.ease = "power1.inOut";
gsap.defaults.duration = 1;

document.addEventListener("DOMContentLoaded", () => {

  const heroImageWrapper = document.getElementById("heroImageWrapper");
  const originalHeroImage = document.querySelector(".heroimggg"); // Select the original img tag

  if (heroImageWrapper && originalHeroImage) {
    originalHeroImage.style.opacity = 0;
    originalHeroImage.style.visibility = "hidden";

    const imgWidth = originalHeroImage.offsetWidth;
    const imgHeight = originalHeroImage.offsetHeight;
    const imageUrl = originalHeroImage.src;

    const rows = 25;
    const cols = 25;
    const pieceWidth = imgWidth / cols;
    const pieceHeight = imgHeight / rows;

    const pieces = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const piece = document.createElement("div");
        piece.className = "image-piece";
        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        piece.style.left = `${j * pieceWidth}px`;
        piece.style.top = `${i * pieceHeight}px`;
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `-${j * pieceWidth}px -${
          i * pieceHeight
        }px`;
        piece.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
        piece.style.position = "absolute";

        heroImageWrapper.appendChild(piece);
        pieces.push(piece);
      }
    }

    const tlPieces = gsap.timeline({
      delay: 0,
      onComplete: () => {
        pieces.forEach((p) => (p.style.display = "none"));
        originalHeroImage.style.opacity = 1;
        originalHeroImage.style.visibility = "visible";
      },
    });

    tlPieces.from(pieces, {
      opacity: 0,
      scale: 0,
      x: () => gsap.utils.random(-imgWidth / 2, imgWidth / 2, 1),
      y: () => gsap.utils.random(-imgHeight / 2, imgHeight / 2, 1),
      rotation: () => gsap.utils.random(-360, 360, 1),
      ease: "power3.out",
      duration: 1.2,
      stagger: {
        each: 0.02,
        from: "random",
        amount: 2,
      },
    });
  } else {
    console.warn(
      "Hero image wrapper or image not found. Image pieces animation not applied."
    );
  }

  const brandTextElement = document.querySelector(".brandtxt");
  const charSpans = splitTextToChars(brandTextElement);

  function splitTextToChars(element) {
    if (!element) return [];

    const text = element.textContent;
    element.textContent = "";

    text.split("").forEach((char) => {
      const span = document.createElement("span");
      if (char === " ") {
        span.innerHTML = "&nbsp;";
        span.style.marginRight = "0.2em";
      } else {
        span.textContent = char;
      }
      span.style.display = "inline-block";
      element.appendChild(span);
    });

    return element.querySelectorAll("span");
  }

  if (brandTextElement) {
    const charSpans = splitTextToChars(brandTextElement);

    gsap.from(charSpans, {
      opacity: 0,
      y: "random(-100, 100)",
      x: "random(-50, 50)",
      scale: 0,
      rotation: "random(-180, 180)",
      ease: "back.out(2.5)",
      duration: 0.8,
      stagger: {
        each: 0.04,
        from: "random",
      },
    });
  }
  const projectSection = document.getElementById("projectSection");
  const twbElements = document.querySelectorAll(".twb");
  const beginProjectBtn = document.getElementById("beginProjectBtn");

  function wrapWords(element) {
    const words = element.textContent.trim().split(/\s+/);
    element.textContent = "";
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.display = "inline-block";
      if (i !== words.length - 1) span.style.marginRight = "0.25em";
      element.appendChild(span);
    });
    return element.querySelectorAll("span");
  }

  if (projectSection && twbElements.length > 0 && beginProjectBtn) {
    const projectTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: projectSection,
        start: "top center",
        toggleActions: "play none none none",
        once: true,
      },
    });

    twbElements.forEach((element) => {
      const wordSpans = wrapWords(element);

      gsap.set(wordSpans, { opacity: 0, y: 20 });

      projectTimeline.to(
        wordSpans,
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.6,
          stagger: 0.05,
        },
        "<0.2"
      );
    });

    projectTimeline
      .fromTo(
        beginProjectBtn,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "<0.5"
      )
      .to(
        beginProjectBtn,
        {
          scale: 1.05,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        },
        "<0.2"
      );
  } else {
    console.warn(
      "Project section elements not found. Scroll-triggered animations not applied."
    );
  }

  const testimonySection = document.getElementById("testimonySection");

  if (!testimonySection) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          testimonySection.classList.add("tumble-in");
          obs.unobserve(testimonySection);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  observer.observe(testimonySection);

  const form = document.getElementById("contactForm");
  if (!form) return;

  const labels = form.querySelectorAll("label.slide-from-left");
  const inputs = form.querySelectorAll(
    "input.slide-from-right, textarea.slide-from-right"
  );

  const formobserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add slide-in class to all labels and inputs to trigger animation
          labels.forEach((label) => label.classList.add("slide-in"));
          inputs.forEach((input) => input.classList.add("slide-in"));

          // Stop observing after animation triggered once
          obs.unobserve(form);
        }
      });
    },
    {
      threshold: 0.3, // trigger when 30% visible, tweak as needed
    }
  );

  formobserver.observe(form);
});
