document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;

  function setActiveStates() {
    // Remove all active states first
    document.querySelectorAll(".nav-link, .section-link").forEach((link) => {
      link.classList.remove("active");
      if (link.href === window.location.href) {
        link.classList.add("active");
      }
    });

    // Only highlight main section if we're on its index page
    const sections = ["pure", "mixed", "combinatorial"];
    for (const section of sections) {
      const sectionPath = `/games/${section}/index.html`;
      if (currentPath.endsWith(sectionPath)) {
        const sectionLink = document.querySelector(`[href*="${sectionPath}"]`);
        if (sectionLink) {
          sectionLink.classList.add("active");
        }
      }
    }
  }

  // Set initial active states
  setActiveStates();
});
