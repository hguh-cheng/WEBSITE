document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('numberInput');
    const submitButton = document.querySelector('.reveal-divider[data-target="game-outcome"]');
    const targetId = submitButton.getAttribute('data-target');
    const target = document.getElementById(targetId);
    const permanentLine = submitButton.parentElement.parentElement.nextElementSibling;
    
    submitButton.addEventListener('click', () => {
      const number = input.value;
      if (number === '' || number < 0 || number > 100) {
        return;
      }
      
      // Store the number for display
      const chosenNumber = document.getElementById('chosen-number');
      chosenNumber.textContent = number;
      
      // Add hiding class
      submitButton.classList.add('hiding');
      input.style.opacity = '0';
      input.style.transform = 'translateY(-10px)';
      input.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        // Hide the input container
        submitButton.parentElement.style.display = 'none';
        
        // Show permanent line
        permanentLine.style.display = 'block';
        permanentLine.offsetHeight; // Trigger reflow
        permanentLine.style.opacity = '1';
        
        // Show and animate the content section
        target.classList.add('visible');
        target.offsetHeight; // Trigger reflow
        target.classList.add('animate');
      }, 300);
    });
    
    // Allow enter key to submit
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitButton.click();
      }
    });
  });