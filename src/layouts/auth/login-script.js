//src/auth/login-script.js
//This script handles the login logic for the application.
import { loginUser } from './auth-script.js';

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const subtitle = document.getElementById('auth-subtitle');

if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.className = 'flex-1 py-2 text-sm font-medium rounded-md bg-gray-800 text-white shadow transition-all';
        tabRegister.className = 'flex-1 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-all';
        subtitle.textContent = 'Welcome back, explorer.';
    });

    tabRegister.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        tabRegister.className = 'flex-1 py-2 text-sm font-medium rounded-md bg-gray-800 text-white shadow transition-all';
        tabLogin.className = 'flex-1 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-white transition-all';
        subtitle.textContent = 'Start your gaming journey.';
    });
}

if(loginForm)
{
    //Handle the login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        //Validate the input fields
        if(!username || !password)
        {
            alert('Por favor, complete todos los campos. ');
            return;
        }

        //Attempt to log in the user
        const result = loginUser(username, password);
        //If login is successful, reload the page to reflect the logged-in state
        if(result.success)
        {
            window.location.href = '../../../index.html'; //Reload the page to reflect the logged-in state
        }else
            //Show an error message if login fails
            alert("Error: " + result.message);
    });
}