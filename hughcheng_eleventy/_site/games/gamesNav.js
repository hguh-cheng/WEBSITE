document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
  
    function setActiveStates() {
      // Remove all active states first
      document.querySelectorAll(".nav-link, .section-link").forEach((link) => {
        link.classList.remove("active");
      });
  
      // First, try to match exact URLs for any nav link
      document.querySelectorAll(".nav-link, .section-link").forEach((link) => {
        if (link.href === window.location.href) {
          link.classList.add("active");
        }
      });
  
      // Then handle section highlighting - but only for index pages
      const sections = ["pure", "mixed", "combinatorial"];
      for (const section of sections) {
        const sectionIndexPath = `/games/${section}/index.html`;
        // Only highlight section if we're on its index page
        if (currentPath.endsWith(sectionIndexPath)) {
          const sectionLinks = document.querySelectorAll(`[href$="${sectionIndexPath}"]`);
          sectionLinks.forEach(link => {
            if (link.classList.contains('section-link')) {
              link.classList.add("active");
            }
          });
        }
      }
    }
  
    // Set initial active states
    setActiveStates();
  });