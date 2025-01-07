document.querySelectorAll('.reveal-divider').forEach(divider => {
    const targetId = divider.getAttribute('data-target');
    const target = document.getElementById(targetId);
    const permanentLine = divider.nextElementSibling;
    
    if (!target) return;
    
    divider.addEventListener('click', function() {
      if (divider.classList.contains('hiding')) return;
      
      // Start arrow rotation and fade out
      divider.classList.add('clicked', 'hiding');
      
      // Wait for divider to fully disappear
      setTimeout(() => {
        divider.style.display = 'none';
        
        // Show permanent line and make it visible
        permanentLine.style.display = 'block';
        permanentLine.offsetHeight; // Trigger reflow
        permanentLine.style.opacity = '1';
        
        // Make content visible but still transparent
        target.classList.add('visible');
        target.offsetHeight; // Trigger reflow
        
        // Animate content in together with line
        target.classList.add('animate');
      }, 300); // After divider fade-out completes
    });
  });