document.addEventListener("DOMContentLoaded", function () {
  // Initialize each reveal container
  document.querySelectorAll(".reveal-container").forEach((container) => {
    let currentSection = 0;
    const sections = container.querySelectorAll(".content-section");
    const continueBtn = container.querySelector(".continue-button");
    const endMessage = container.querySelector(".end-message");

    // Show first section initially
    if (sections.length > 0) {
      sections[0].classList.add("visible");
    }

    // Update button/message visibility for this container
    function updateControls() {
      if (currentSection >= sections.length - 1) {
        continueBtn.style.display = "none";
        endMessage.style.display = "block";
      } else {
        continueBtn.style.display = "inline-block";
        endMessage.style.display = "none";
      }
    }

    // Handle continue button click for this container
    continueBtn.addEventListener("click", function () {
      currentSection++;
      if (currentSection < sections.length) {
        sections[currentSection].classList.add("visible");
        updateControls();
      }
    });

    // Initial controls update
    updateControls();
  });
});
