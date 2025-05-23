document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, starting registration script...');
  
  // Function to safely get element
  function safeGetElement(id) {
    const element = document.getElementById(id);
    console.log(`Element ${id}:`, element);
    return element;
  }
  
  // Get all elements safely
  const form = safeGetElement('registrationForm');
  const fullnameInput = safeGetElement('fullname');
  const emailInput = safeGetElement('email');
  
  // Try multiple possible password field IDs
  let passwordInput = safeGetElement('password');
  if (!passwordInput) {
    passwordInput = safeGetElement('password1');
    console.log('Trying password1:', passwordInput);
  }
  
  let confirmPasswordInput = safeGetElement('confirm-password');
  if (!confirmPasswordInput) {
    confirmPasswordInput = safeGetElement('password2');
    console.log('Trying password2:', confirmPasswordInput);
  }
  
  // Get error elements
  const fullnameError = safeGetElement('fullname-error');
  const emailError = safeGetElement('email-error');
  const matchError = safeGetElement('password-match-error');
  
  // Get password requirement elements
  const requirements = {
    length: safeGetElement('length-req'),
    space: safeGetElement('space-req'),
    upper: safeGetElement('upper-req'),
    lower: safeGetElement('lower-req'),
    number: safeGetElement('number-req'),
    special: safeGetElement('special-req')
  };
  
  // Check which elements are missing
  console.log('=== ELEMENT CHECK ===');
  console.log('Form found:', !!form);
  console.log('Password input found:', !!passwordInput);
  console.log('Confirm password found:', !!confirmPasswordInput);
  console.log('Requirements found:', Object.keys(requirements).filter(key => requirements[key]).length + '/6');
  
  // Exit if no password input found
  if (!passwordInput) {
    console.error('❌ CRITICAL: No password input found! Check your HTML for id="password" or id="password1"');
    return;
  }
  
  // Hide all errors initially
  function hideAllErrors() {
    if (fullnameError) fullnameError.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    if (matchError) matchError.style.display = 'none';
  }
  
  hideAllErrors();
  
  // Password requirement update function
  function updateRequirement(element, isValid, name) {
    if (!element) {
      console.warn(`❌ Missing requirement element: ${name}`);
      return;
    }
    
    console.log(`${name}: ${isValid ? '✅' : '❌'}`);
    
    if (isValid) {
      element.classList.remove('invalid');
      element.classList.add('valid');
    } else {
      element.classList.remove('valid');
      element.classList.add('invalid');
    }
  }
  
  // Real-time password validation
  console.log('🔒 Setting up password validation...');
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    console.log('Password input detected:', password.length + ' characters');
    
    // Check each requirement
    updateRequirement(requirements.length, password.length >= 10, 'Length (10+)');
    updateRequirement(requirements.space, !/\s/.test(password), 'No Spaces');
    updateRequirement(requirements.upper, /[A-Z]/.test(password), 'Uppercase');
    updateRequirement(requirements.lower, /[a-z]/.test(password), 'Lowercase');
    updateRequirement(requirements.number, /[0-9]/.test(password), 'Number');
    updateRequirement(requirements.special, /[!@#$%^()\-\[\]]/.test(password), 'Special Char');
    
    // Check password match
    if (confirmPasswordInput && confirmPasswordInput.value && matchError) {
      const match = password === confirmPasswordInput.value;
      matchError.style.display = match ? 'none' : 'block';
      console.log('Password match:', match ? '✅' : '❌');
    }
  });
  
  console.log('✅ Password validation setup complete!');
  
  // Fullname validation (if element exists)
  if (fullnameInput) {
    console.log('👤 Setting up fullname validation...');
    
    fullnameInput.addEventListener('input', function() {
      const fullname = this.value.trim();
      const isValid = /^[a-zA-Z\s]*$/.test(fullname);
      
      if (!isValid) {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
      }
      
      if (fullnameError) {
        fullnameError.style.display = fullname && !isValid ? 'block' : 'none';
      }
    });
    
    fullnameInput.addEventListener('blur', function() {
      const fullname = this.value.trim();
      const isValid = /^[a-zA-Z\s]+$/.test(fullname) && fullname.length >= 2;
      if (fullnameError) {
        fullnameError.style.display = !fullname || !isValid ? 'block' : 'none';
      }
    });
  }
  
  // Email validation (if element exists)
  if (emailInput) {
    console.log('📧 Setting up email validation...');
    
    emailInput.addEventListener('input', function() {
      const email = this.value.trim();
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      if (emailError) {
        emailError.style.display = email && !isValidEmail ? 'block' : 'none';
      }
    });
    
    emailInput.addEventListener('blur', function() {
      const email = this.value.trim();
      const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      if (emailError) {
        emailError.style.display = !email || !isValidEmail ? 'block' : 'none';
      }
    });
  }
  
  // Confirm password validation (if element exists)
  if (confirmPasswordInput) {
    console.log('🔒 Setting up confirm password validation...');
    
    confirmPasswordInput.addEventListener('input', function() {
      const password = passwordInput ? passwordInput.value : '';
      const confirmPassword = this.value;
      if (matchError) {
        const match = password === confirmPassword;
        matchError.style.display = password && confirmPassword && !match ? 'block' : 'none';
        console.log('Confirm password match:', match ? '✅' : '❌');
      }
    });
  }
  
  // Form submission validation - FIXED VERSION
  if (form) {
    console.log('📝 Setting up form submission...');
    
    form.addEventListener('submit', function(event) {
      console.log('Form submission started...');
      
      let isValid = true;
      
      // Validate fullname
      if (fullnameInput) {
        const fullname = fullnameInput.value.trim();
        const isFullnameValid = /^[a-zA-Z\s]+$/.test(fullname) && fullname.length >= 2;
        
        if (!isFullnameValid && fullnameError) {
          fullnameError.style.display = 'block';
          isValid = false;
        }
      }
      
      // Validate email
      if (emailInput) {
        const email = emailInput.value.trim();
        const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        
        if (!isEmailValid && emailError) {
          emailError.style.display = 'block';
          isValid = false;
        }
      }
      
      // Validate password
      if (passwordInput) {
        const password = passwordInput.value;
        const isPasswordValid = password.length >= 10 &&
                               !/\s/.test(password) &&
                               /[A-Z]/.test(password) &&
                               /[a-z]/.test(password) &&
                               /[0-9]/.test(password) &&
                               /[!@#$%^()\-\[\]]/.test(password);
        
        if (!isPasswordValid) {
          isValid = false;
        }
      }
      
      // Validate password match
      if (passwordInput && confirmPasswordInput) {
        const match = passwordInput.value === confirmPasswordInput.value;
        if (!match && matchError) {
          matchError.style.display = 'block';
          isValid = false;
        }
      }
      
      console.log('Form validation result:', isValid ? '✅ VALID' : '❌ INVALID');
      
      // ✅ FIXED: Only prevent submission if validation fails
      if (!isValid) {
        event.preventDefault();  // Prevent submission only if invalid
        console.log('❌ Form submission prevented due to validation errors');
        return false;
      }
      
      // ✅ If validation passes, let Django handle the form submission
      console.log('✅ Form is valid, submitting to Django...');
      // Don't prevent default - let the form submit naturally to Django
    });
  }
  
  // Success popup function - UPDATED to redirect to login
  function showSuccessPopup() {
    console.log('🎉 Registration successful, redirecting to login...');
    
    const popup = document.getElementById('naturePopup');
    if (popup) {
      popup.style.display = 'block';
      setTimeout(() => {
        console.log('Redirecting to login page...');
        // Use your actual login URL - adjust if needed
        window.location.href = "/login/";  // This matches your URL pattern
      }, 2500);
    } else {
      // If no popup, redirect immediately
      window.location.href = "/login/";
    }
  }
  // Make function globally accessible
  window.showSuccessPopup = showSuccessPopup;
  
  console.log('🚀 Registration script initialization complete!');
});