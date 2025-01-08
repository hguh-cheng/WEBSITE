document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('numberInput');
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.querySelector('.reveal-divider[data-target="game-outcome"]');
    const targetId = submitButton.getAttribute('data-target');
    const target = document.getElementById(targetId);
    const permanentLine = submitButton.parentElement.parentElement.nextElementSibling;
    
    // Initially disable submit button
    submitButton.classList.add('disabled');
    
    function validateInput() {
      const number = input.value;
      input.classList.remove('invalid');
      errorMessage.textContent = '';
      
      if (number === '') {
        input.classList.add('invalid');
        errorMessage.textContent = 'Please enter a number';
        submitButton.classList.add('disabled');
        return false;
      }
      
      const numberValue = parseFloat(number);
      
      if (isNaN(numberValue)) {
        input.classList.add('invalid');
        errorMessage.textContent = 'Please enter a valid number';
        submitButton.classList.add('disabled');
        return false;
      }
      
      if (numberValue < 0 || numberValue > 1200) {
        input.classList.add('invalid');
        errorMessage.textContent = 'Please enter a number between 0 and 1200';
        submitButton.classList.add('disabled');
        return false;
      }
      
      // Input is valid, enable submit button
      submitButton.classList.remove('disabled');
      return true;
    }
    
    submitButton.addEventListener('click', () => {
      // Double-check validation in case the button was clicked programmatically
      if (!validateInput() || submitButton.classList.contains('disabled')) {
        return;
      }
      
      const number = parseFloat(input.value);
      const isOptimal = Math.abs(number - 400) < 0.0001;  // Allow for small floating point differences
      
      // Update all number displays
      document.querySelectorAll('#chosen-number').forEach(element => {
        element.textContent = number;
      });
      
      // Add hiding class
      submitButton.classList.add('hiding');
      input.style.opacity = '0';
      input.style.transform = 'translateY(-10px)';
      input.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      errorMessage.style.opacity = '0';
      errorMessage.style.transition = 'opacity 0.3s ease';
      
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
        
        // Show the appropriate content based on the choice
        const optimalContent = document.getElementById('optimal-choice');
        const suboptimalContent = document.getElementById('suboptimal-choice');
        
        if (isOptimal) {
          optimalContent.style.display = 'block';
          suboptimalContent.style.display = 'none';
        } else {
          optimalContent.style.display = 'none';
          suboptimalContent.style.display = 'block';
        }
      }, 300);
    });
    
    // Validate on input to give immediate feedback
    input.addEventListener('input', validateInput);
    
    // Allow enter key to submit only if input is valid
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!submitButton.classList.contains('disabled')) {
          submitButton.click();
        }
      }
    });
  });