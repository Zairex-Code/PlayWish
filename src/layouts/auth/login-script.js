//src/auth/login-script.js
//This script handles the login logic for the application.
import { loginUser } from './auth-script.js';

const loginForm = document.getElementById('login-form');

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
            window.location.reload();
        }else
            //Show an error message if login fails
            alert("Error: " + result.message);
    });
}