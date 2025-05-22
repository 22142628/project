

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('registrationForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    
    const fullnameError = document.getElementById('fullname-error');
    const emailError = document.getElementById('email-error');
    const matchError = document.getElementById('password-match-error');
    
    
    const lengthReq = document.getElementById('length-req');
    const spaceReq = document.getElementById('space-req');
    const upperReq = document.getElementById('upper-req');
    const lowerReq = document.getElementById('lower-req');
    const numberReq = document.getElementById('number-req');
    const specialReq = document.getElementById('special-req');
    
    
    fullnameInput.addEventListener('input', function() {
      const fullname = this.value.trim();
      const isValid = /^[a-zA-Z\s]*$/.test(fullname);
      
      
      if (!isValid) {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
      }
      
     
      fullnameError.style.display = fullname && !isValid ? 'block' : 'none';
    });
    
    fullnameInput.addEventListener('blur', function() {
      const fullname = this.value.trim();
      const isValid = /^[a-zA-Z\s]+$/.test(fullname) && fullname.length >= 2;
      fullnameError.style.display = !fullname || !isValid ? 'block' : 'none';
    });
    
    
    emailInput.addEventListener('input', function() {
      const email = this.value.trim();
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      emailError.style.display = email && !isValidEmail ? 'block' : 'none';
    });
    
    emailInput.addEventListener('blur', function() {
      const email = this.value.trim();
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      emailError.style.display = !email || !isValidEmail ? 'block' : 'none';
    });
  
   
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      
      
      toggleRequirement(lengthReq, password.length >= 10);
      toggleRequirement(spaceReq, !/\s/.test(password));
      toggleRequirement(upperReq, /[A-Z]/.test(password));
      toggleRequirement(lowerReq, /[a-z]/.test(password));
      toggleRequirement(numberReq, /[0-9]/.test(password));
      toggleRequirement(specialReq, /[!@#$%^()-]/.test(password));
      
    
      if (confirmPasswordInput.value) {
        matchError.style.display = password !== confirmPasswordInput.value ? 'block' : 'none';
      }
    });
  
   
    confirmPasswordInput.addEventListener('input', function() {
      const password = passwordInput.value;
      const confirmPassword = this.value;
      matchError.style.display = password && confirmPassword && password !== confirmPassword ? 'block' : 'none';
    });
  
   
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      let isValid = true;
      
     
      const fullname = fullnameInput.value.trim();
      const isFullnameValid = /^[a-zA-Z\s]+$/.test(fullname) && fullname.length >= 2;
      if (!fullname || !isFullnameValid) {
        fullnameError.style.display = 'block';
        isValid = false;
      } else {
        fullnameError.style.display = 'none';
      }
      
      
      const email = emailInput.value.trim();
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      if (!email || !isValidEmail) {
        emailError.style.display = 'block';
        isValid = false;
      } else {
        emailError.style.display = 'none';
      }
      
      
      const password = passwordInput.value;
      const isValidPassword = password.length >= 10 &&
                            !/\s/.test(password) &&
                            /[A-Z]/.test(password) &&
                            /[a-z]/.test(password) &&
                            /[0-9]/.test(password) &&
                            /[!@#$%^()-]/.test(password);
      
      if (!isValidPassword) {
        isValid = false;
      }
      
     
      const confirmPassword = confirmPasswordInput.value;
      const passwordsMatch = password === confirmPassword;
      if (!passwordsMatch) {
        matchError.style.display = 'block';
        isValid = false;
      } else {
        matchError.style.display = 'none';
      }
  
      
      if (isValid) {
        showSuccessPopup();
      } else {
        
        if (!fullname || !isFullnameValid) {
          fullnameInput.focus();
        } else if (!email || !isValidEmail) {
          emailInput.focus();
        } else if (!isValidPassword) {
          passwordInput.focus();
        } else if (!passwordsMatch) {
          confirmPasswordInput.focus();
        }
      }
    });
  
    
    function toggleRequirement(el, isValid) {
      el.classList.toggle('valid', isValid);
      el.classList.toggle('invalid', !isValid);
    }
    
    
    function showSuccessPopup() {
      const popup = document.createElement('div');
      popup.className = 'nature-popup';
      popup.textContent = 'WELCOME TO THE TRAIL TRACKER COMMUNITY!';
      document.body.appendChild(popup);
      
      
      setTimeout(() => {
        window.location.href = "{% url 'home' %}";
      }, 2500);
    }
  });