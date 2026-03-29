//src/layouts/auth/auth-script.js
//This is the main script that simulates how data is stored in the database.

//Keys localStorage
const USERS_KEY = 'playwish_users';
const SESSION_KEY = 'playwish_currentUser';

//Function to get all users from localStorage
export function getAllUsers()
{
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

//function to save a new user to localStorage
export function registerUser(username, email, password)
{
    const users = getAllUsers();

    if(users[username]) return { success: false, message: 'El usuario ya existe. '};

    //Create a new user object
    users[username] = {
        email: email,
        password: password,
        wishlist: [],
        gamesExplored: 0
    };

    //Save the updated users object back to localStorage
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, message: 'Usuario registrado exitosamente. '};
}

//Function to authenticate a user
export function loginUser(username, password)
{
    const users = getAllUsers();
    const user = users[username];

    if(!user || user.password !== password) return { success: false, message: 'Credenciales inválidas. '};

    localStorage.setItem(SESSION_KEY, username);
    return { success: true, message: 'Inicio de sesión exitoso. '};
}

//Function to get the current logged in user
export function getCurrentUser()
{
    return localStorage.getItem(SESSION_KEY);
}

//Function to log out the current user
export function logoutUser()
{
    localStorage.removeItem(SESSION_KEY);
    return { success: true, message: 'Cierre de sesión exitoso. '};
}

//Function to update the Navbar based on the user's login state
export function initNavbarAuth(){
  const loginLink = document.getElementById('nav-login-link');
  const userProfileSection = document.getElementById('nav-user-profile');
  const usernameDisplay = document.getElementById('nav-username');
  const logoutBtn = document.getElementById('nav-logout-btn');
  
  const currentUser = getCurrentUser();

  if(currentUser){
    //If user is logged in, show the profile section and hide the login link
    if(loginLink) loginLink.classList.add('hidden');
    if (userProfileSection) {
        userProfileSection.classList.remove('hidden');
        userProfileSection.classList.add('flex');
      }
    if(usernameDisplay) usernameDisplay.textContent = currentUser;

    if(logoutBtn){
      const newLogoutBtn = logoutBtn.cloneNode(true); //Clone the button to remove old event listeners
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn); //Replace the old button with the new one
      newLogoutBtn.addEventListener('click', () => {
        logoutUser();
        alert('Logged out successfully. Redirecting to homepage...');
        window.location.href = '../../../index.html'; // Redirect to homepage after logout
      });
    }
  //If no user is logged in, show the login link and hide the profile section
  } else{
    if(loginLink) loginLink.classList.remove('hidden');
    if(userProfileSection){
      userProfileSection.classList.add('hidden');
      userProfileSection.classList.remove('flex');
    }
  }
}