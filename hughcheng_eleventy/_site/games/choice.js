document.querySelectorAll('.reveal-divider[data-choice]').forEach(divider => {
    const targetId = divider.getAttribute('data-target');
    const choice = divider.getAttribute('data-choice');
    const target = document.getElementById(targetId);
    const permanentLine = divider.parentElement.parentElement.nextElementSibling;
    
    if (!target) return;
    
    divider.addEventListener('click', function() {
      if (divider.classList.contains('hiding')) return;
      
      // Hide both choice buttons together
      const allChoiceDividers = document.querySelectorAll('.reveal-divider[data-choice]');
      allChoiceDividers.forEach(div => {
        div.classList.add('hiding');
      });
      
      // Add clicked class only to selected button
      divider.classList.add('clicked');
      
      setTimeout(() => {
        // Hide the choice container
        const choiceContainer = divider.parentElement;
        choiceContainer.style.display = 'none';
        
        // Show permanent line
        permanentLine.style.display = 'block';
        permanentLine.offsetHeight; // Trigger reflow
        permanentLine.style.opacity = '1';
        
        // Show and animate the content section
        target.classList.add('visible');
        target.offsetHeight; // Trigger reflow
        target.classList.add('animate');
        
        // Hide all choice-specific content first
        document.querySelectorAll('.choice-specific-content').forEach(content => {
          content.classList.remove('visible');
        });
        
        // Show only the selected choice content
        const initialContent = document.getElementById(`initial-${choice}`);
        if (initialContent) {
          initialContent.classList.add('visible');
        }
      }, 300);
    });
  });