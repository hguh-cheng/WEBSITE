document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
  
    function setActiveStates() {
      // Remove all active states first
      document.querySelectorAll(".nav-link, .section-link").forEach((link) => {
        link.classList.remove("active");
      });
  
      // Handle both URLs ending in / and /index.html
      document.querySelectorAll(".nav-link, .section-link").forEach((link) => {
        const linkPath = link.href.replace(window.location.origin, '');
        const currentPathNormalized = currentPath.endsWith('/') ? currentPath + 'index.html' : currentPath;
        const linkPathNormalized = linkPath.endsWith('/') ? linkPath + 'index.html' : linkPath;
        
        if (currentPathNormalized === linkPathNormalized) {
          link.classList.add("active");
        }
      });
  
      // Then handle section highlighting - only for index pages or directory root
      const sections = ["pure", "mixed", "combinatorial"];
      for (const section of sections) {
        const sectionPath = `/games/${section}/`;
        const sectionIndexPath = `/games/${section}/index.html`;
        
        // Check both formats of the URL
        if (currentPath === sectionPath || currentPath.endsWith(sectionIndexPath)) {
          const sectionLinks = document.querySelectorAll(`[href*="${sectionPath}"]`);
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