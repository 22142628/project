

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");
    const loginError = document.getElementById("login-error");
    
    
    usernameError.style.display = 'none';
    passwordError.style.display = 'none';
    loginError.textContent = '';
    
    
    usernameInput.addEventListener('blur', function() {
      const username = this.value.trim();
      usernameError.style.display = !username ? 'block' : 'none';
    });
    
    
    passwordInput.addEventListener('blur', function() {
      const password = this.value.trim();
      passwordError.style.display = !password ? 'block' : 'none';
    });
    
    
    function redirectToHomepage() {
      window.location.href = "homepage-dash.html";
    }
    
    function redirectToAdminPage() {
      window.location.href = "trail-approval.html";
    }
    
    
    function showNaturePopup() {
      const popup = document.createElement('div');
      popup.className = 'popup nature-popup';
      popup.innerHTML = `
        <h3>Login Successful!</h3>
        <p>Welcome to your adventure dashboard</p>
        <button onclick="redirectToHomepage()">Continue</button>
      `;
      document.body.appendChild(popup);
    }
    
    
    function showAdminPopup() {
      const popup = document.createElement('div');
      popup.className = 'popup admin-popup';
      popup.innerHTML = `
        <h3>Welcome back Admin!</h3>
        <p>Access your trail management dashboard</p>
        <button onclick="redirectToAdminPage()">Continue</button>
      `;
      document.body.appendChild(popup);
    }
    
    
    form.addEventListener("submit", function(event) {
      
      event.preventDefault();
      
      
      usernameError.style.display = 'none';
      passwordError.style.display = 'none';
      loginError.textContent = '';
      
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      
      
      let isValid = true;
      
      
      if (!username) {
        usernameError.style.display = 'block';
        isValid = false;
      }
      
      
      if (!password) {
        passwordError.style.display = 'block';
        isValid = false;
      }
      
      
      if (!isValid) {
        if (!username) {
          usernameInput.focus();
        } else if (!password) {
          passwordInput.focus();
        }
        return;
      }
      
      
      const adminAccounts = [
        { username: "Anastasia", password: "22150049" },
        { username: "Shadman",   password: "22102457" },
        { username: "Robinson",  password: "22142628" },
        { username: "Kritika",   password: "22076631" }
      ];
      
      
      const regularUser = {
        username: "Shaddy", 
        password: "Jami"
      };
      
      
      const isAdmin = adminAccounts.some(acc =>
        acc.username === username && acc.password === password
      );
      
      
      const isRegularUser = 
        username === regularUser.username && password === regularUser.password;
      
      
      if (isAdmin) {
       
        window.redirectToAdminPage = redirectToAdminPage;
        showAdminPopup();
      } else if (isRegularUser) {
        
        window.redirectToHomepage = redirectToHomepage;
        showNaturePopup();
      } else {
        
        loginError.textContent = "Invalid username or password!";
        loginError.style.display = 'block';
      }
    });
  });
