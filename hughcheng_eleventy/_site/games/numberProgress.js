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
      
      // Check if the number is not an integer
      if (!Number.isInteger(numberValue)) {
        input.classList.add('invalid');
        errorMessage.textContent = 'Please enter a whole number';
        submitButton.classList.add('disabled');
        return false;
      }
      
      if (isNaN(numberValue) || numberValue < 0 || numberValue > 100) {
        input.classList.add('invalid');
        errorMessage.textContent = 'Please enter a whole number between 0 and 100';
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
      
      const number = input.value;
      
      // Store the number for display
      const chosenNumber = document.getElementById('chosen-number');
      chosenNumber.textContent = number;
      
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