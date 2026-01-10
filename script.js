document.addEventListener("DOMContentLoaded", () => {
  const ribbon = document.getElementById("ribbon");
  const navItems = document.querySelectorAll(".nav-item");
  const navList = document.getElementById("nav-list");

  function moveAndResizeRibbon(target) {
    const listRect = navList.getBoundingClientRect();
    const itemRect = target.getBoundingClientRect();

    // Calculate the center position of the active item
    const centerX = itemRect.left - listRect.left + itemRect.width / 2;

    // Calculate the width needed (add some padding for better appearance)
    const linkWidth = itemRect.width;
    const padding = 50; // Extra padding on each side (25px per side)
    const ribbonWidth = Math.max(linkWidth + padding, 78); // Minimum width of 78px

    // Set the ribbon position and width
    ribbon.style.left = `${centerX - ribbonWidth / 2}px`;

    ribbon.style.width = `${ribbonWidth}px`;

    // Update SVG and path to scale properly
    const svg = ribbon.querySelector("svg");
    if (svg) {
      const originalWidth = 98;
      const originalHeight = 110;
      const scaleX = ribbonWidth / originalWidth;

      // Update SVG dimensions
      svg.setAttribute("width", ribbonWidth);
      svg.setAttribute("height", "85");

      // Update viewBox to accommodate the new width (add some padding to prevent clipping)
      const viewBoxPadding = 4; // Padding to prevent edge clipping
      svg.setAttribute(
        "viewBox",
        `0 0 ${ribbonWidth + viewBoxPadding * 2} ${originalHeight}`
      );

      // Update the path to scale horizontally
      const path = svg.querySelector("path");
      if (path) {
        // Original path coordinates: M4 4C4 1.79086 5.79086 0 8 0H90C92.2091 0 94 1.79086 94 4V101.5L49 81.2L4 101.5V4Z
        // We need to scale the x-coordinates while keeping y-coordinates the same
        // Adjust for viewBox padding
        const adjustedLeft = 4 + viewBoxPadding;
        const newRight = adjustedLeft + 90 * scaleX; // Scale the width from 90 to new width
        const newCenter = adjustedLeft + 45 * scaleX; // Center point scales proportionally
        const newControlRight = adjustedLeft + 86 * scaleX; // Control point for right corner

        // Create new path with scaled x-coordinates
        const newPath = `M${adjustedLeft} 4C${adjustedLeft} 1.79086 ${
          adjustedLeft + 1.79086
        } 0 ${adjustedLeft + 4} 0H${newRight}C${newControlRight} 0 ${
          newRight + 4
        } 1.79086 ${
          newRight + 4
        } 4V101.5L${newCenter} 81.2L${adjustedLeft} 101.5V4Z`;
        path.setAttribute("d", newPath);
      }
    }
  }

  // Initial → Home
  const activeItem = document.querySelector(".nav-item.active");
  if (activeItem) moveAndResizeRibbon(activeItem);

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Update active state and ribbon
      navItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
      moveAndResizeRibbon(this);

      // Smooth scroll to target section
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          // Calculate offset to account for fixed header
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight;

          // Smooth scroll to target
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-item.active");
    if (active) moveAndResizeRibbon(active);
  });

  // Typing Animation
  function typeText() {
    const typingElement = document.getElementById("typing-text");
    const headSpan = typingElement.querySelector(".head");
    const cursor = typingElement.querySelector(".typing-cursor");

    if (!typingElement || !headSpan) return;

    const headText = "Foundation ";
    const restText = "built on";
    const explorationText = "Exploration, Play and Care";

    function clearContent() {
      // Clear all content except head span and cursor
      headSpan.textContent = "";
      const restSpan = typingElement.querySelector(
        "span:not(.head):not(.typing-cursor)"
      );
      if (restSpan) restSpan.remove();
      const br = typingElement.querySelector("br");
      if (br) br.remove();
      const explorationSpan = typingElement.querySelector(".exploration");
      if (explorationSpan) explorationSpan.remove();
      // Show cursor again and reset to dark color
      if (cursor) {
        cursor.style.display = "inline-block";
        cursor.style.color = "#0f0339"; // Reset to dark color
      }
    }

    function type() {
      let currentIndex = 0;
      let phase = 1; // 1: head, 2: rest, 3: exploration

      function typeChar() {
        if (phase === 1) {
          // Type "Foundation " (dark text - keep cursor dark)
          if (cursor) cursor.style.color = "#0f0339";
          if (currentIndex < headText.length) {
            headSpan.textContent = headText.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeChar, 80);
          } else {
            phase = 2;
            currentIndex = 0;
            setTimeout(typeChar, 200);
          }
        } else if (phase === 2) {
          // Type "built on" after Foundation (white text - change cursor to white)
          if (cursor) cursor.style.color = "#ffffff";
          if (
            !headSpan.nextElementSibling ||
            headSpan.nextElementSibling === cursor
          ) {
            const restSpan = document.createElement("span");
            restSpan.textContent = "";
            restSpan.style.color = "#ffffff";
            typingElement.insertBefore(restSpan, cursor);
          }
          const restSpan = headSpan.nextElementSibling;
          if (restSpan && restSpan !== cursor) {
            restSpan.style.color = "#ffffff";
          }
          if (currentIndex < restText.length) {
            restSpan.textContent = restText.substring(0, currentIndex + 1);
            currentIndex++;
            setTimeout(typeChar, 80);
          } else {
            // Add space after "built on"
            restSpan.textContent = restText + " ";
            // Add line break
            const br = document.createElement("br");
            typingElement.insertBefore(br, cursor);
            phase = 3;
            currentIndex = 0;
            setTimeout(typeChar, 300);
          }
        } else if (phase === 3) {
          // Type "Exploration, Play and Care" (white text - keep cursor white)
          if (cursor) cursor.style.color = "#ffffff";
          let explorationSpan = typingElement.querySelector(".exploration");
          if (!explorationSpan) {
            explorationSpan = document.createElement("span");
            explorationSpan.className = "exploration";
            explorationSpan.textContent = "";
            explorationSpan.style.color = "#ffffff";
            typingElement.insertBefore(explorationSpan, cursor);
          }
          if (explorationSpan) {
            explorationSpan.style.color = "#ffffff";
          }
          if (currentIndex < explorationText.length) {
            explorationSpan.textContent = explorationText.substring(
              0,
              currentIndex + 1
            );
            currentIndex++;
            setTimeout(typeChar, 80);
          } else {
            // Wait a bit, then clear and restart
            setTimeout(() => {
              clearContent();
              // Restart animation after a short pause
              setTimeout(type, 1000);
            }, 2000); // Show completed text for 2 seconds before restarting
          }
        }
      }

      // Start typing
      typeChar();
    }

    // Start typing after a short delay
    setTimeout(type, 500);
  }

  // Initialize typing animation
  typeText();

  // Journey Scroll Indicators and Buttons
  const journeyContainer = document.querySelector(".journey");
  const indicatorsContainer = document.querySelector(".journey-indicators");
  const scrollLeftBtn = document.querySelector(".journey-scroll-left");
  const scrollRightBtn = document.querySelector(".journey-scroll-right");

  // Scroll button functionality
  if (journeyContainer && scrollLeftBtn && scrollRightBtn) {
    const scrollAmount = 300; // pixels to scroll per click

    scrollLeftBtn.addEventListener("click", () => {
      journeyContainer.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    });

    scrollRightBtn.addEventListener("click", () => {
      journeyContainer.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    });

    // Update button visibility based on scroll position
    function updateButtonVisibility() {
      const scrollLeft = journeyContainer.scrollLeft;
      const maxScroll =
        journeyContainer.scrollWidth - journeyContainer.offsetWidth;

      // Hide left button at start, right button at end
      scrollLeftBtn.style.opacity = scrollLeft <= 0 ? "0.5" : "1";
      scrollLeftBtn.style.pointerEvents = scrollLeft <= 0 ? "none" : "auto";

      scrollRightBtn.style.opacity = scrollLeft >= maxScroll - 1 ? "0.5" : "1";
      scrollRightBtn.style.pointerEvents =
        scrollLeft >= maxScroll - 1 ? "none" : "auto";
    }

    journeyContainer.addEventListener("scroll", updateButtonVisibility);
    updateButtonVisibility();
  }

  if (journeyContainer && indicatorsContainer) {
    const journeyItems = journeyContainer.querySelectorAll(
      ".journey1, .journey2, .journey3, .journey4, .journey5"
    );

    // Create exactly 3 dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.className = "journey-dot";
      if (i === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        // Calculate scroll position based on dot index
        const maxScroll =
          journeyContainer.scrollWidth - journeyContainer.offsetWidth;
        const scrollPosition = (maxScroll / 2) * i; // Distribute across 3 positions
        journeyContainer.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      });
      indicatorsContainer.appendChild(dot);
    }

    // Update active dot based on scroll position
    function updateActiveDot() {
      const scrollLeft = journeyContainer.scrollLeft;
      const maxScroll =
        journeyContainer.scrollWidth - journeyContainer.offsetWidth;
      const scrollProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      const dots = indicatorsContainer.querySelectorAll(".journey-dot");

      // Determine which dot should be active (0, 1, or 2)
      let activeIndex = 0;
      if (scrollProgress < 0.33) {
        activeIndex = 0;
      } else if (scrollProgress < 0.67) {
        activeIndex = 1;
      } else {
        activeIndex = 2;
      }

      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    // Update on scroll
    journeyContainer.addEventListener("scroll", updateActiveDot);

    // Initial update
    updateActiveDot();
  }

  // FAQ Accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');
    
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
});
