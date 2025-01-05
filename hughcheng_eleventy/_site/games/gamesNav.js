document.addEventListener("DOMContentLoaded", function () {
  const sectionHeaders = document.querySelectorAll(".section-header");
  const currentPath = window.location.pathname;

  // Get parent section ID from path
  function getParentSectionId(path) {
    const sections = ["pure", "mixed", "combinatorial"];
    for (const section of sections) {
      if (path.includes(`/games/${section}/`)) {
        return `collapse-${section}-equilibria`;
      }
    }
    return null;
  }

  // Reset accordion states
  function resetAccordions() {
    document.querySelectorAll(".accordion-button").forEach((button) => {
      button.classList.add("collapsed");
      const target = document.querySelector(
        button.getAttribute("data-bs-target")
      );
      if (target) {
        target.classList.remove("show");
      }
    });
  }

  // Set active accordion and subtab
  function setActiveSection(sectionId) {
    resetAccordions();

    const activeAccordion = document.getElementById(sectionId);
    if (activeAccordion) {
      const parentButton =
        activeAccordion.previousElementSibling.querySelector(
          ".accordion-button"
        );
      if (parentButton) {
        // Highlight the main accordion button
        document.querySelectorAll(".accordion-button").forEach((btn) => {
          btn.classList.remove("active");
        });
        parentButton.classList.remove("collapsed");
        parentButton.classList.add("active");
        activeAccordion.classList.add("show");
      }
    }

    // Highlight active subtab
    document.querySelectorAll(".accordion-body .nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });
  }

  // Handle subtab highlighting on load
  const activeLink = document.querySelector(".accordion-body .nav-link.active");
  if (activeLink) {
    const parentCollapse = activeLink.closest(".accordion-collapse");
    if (parentCollapse) {
      const sectionId = parentCollapse.id;
      sessionStorage.setItem("activeAccordion", sectionId);
      setActiveSection(sectionId);
    }
  } else {
    // Expand the main tab based on URL
    const parentSectionId = getParentSectionId(currentPath);
    if (parentSectionId) {
      sessionStorage.setItem("activeAccordion", parentSectionId);
      setActiveSection(parentSectionId);
    }
  }

  // Restore accordion state from sessionStorage
  const activeAccordionId = sessionStorage.getItem("activeAccordion");
  if (activeAccordionId) {
    setActiveSection(activeAccordionId);
  }

  // Handle accordion clicks
  sectionHeaders.forEach((header) => {
    header.addEventListener("click", function (e) {
      const buttonRect = this.getBoundingClientRect();
      const clickX = e.clientX - buttonRect.left;
      const arrowZone = 60; // Width of the arrow area

      if (clickX < buttonRect.width - arrowZone) {
        // Handle main tab navigation
        const href = this.getAttribute("data-href");
        if (href) {
          const targetCollapse = this.getAttribute("data-bs-target");
          if (targetCollapse) {
            const accordionId = targetCollapse.substring(1);
            sessionStorage.setItem("activeAccordion", accordionId);

            // Highlight clicked accordion button
            document.querySelectorAll(".accordion-button").forEach((btn) => {
              btn.classList.remove("active");
            });
            this.classList.add("active");
          }
          window.location.href = href;
        }
      } else {
        // Toggle accordion state
        const targetCollapse = this.getAttribute("data-bs-target");
        if (targetCollapse) {
          const accordionId = targetCollapse.substring(1);
          const isCurrentlyActive =
            sessionStorage.getItem("activeAccordion") === accordionId;

          if (!isCurrentlyActive) {
            sessionStorage.setItem("activeAccordion", accordionId);
            setActiveSection(accordionId);
          } else {
            resetAccordions();
            sessionStorage.removeItem("activeAccordion");
          }
        }
      }
    });
  });
});
