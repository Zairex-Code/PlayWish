//src/auth/register-script.js
//This script handles the registration logic for the application.
import { registerUser, loginUser } from './auth-script.js';

const registerForm = document.getElementById('register-form')

if(registerForm)
{
    //Handle the registration form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;

        //Validate the input fields
        if(!username || !email || !password)
        {
            alert('Por favor, complete todos los campos. ');
            return;
        }

        //Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
        {
            alert('Por favor, ingrese un correo electrónico válido. ');
            return;
        }

        //Password length validation
        if(password.length < 6)
        {
            alert('La contraseña debe tener al menos 6 caracteres. ');
            return;
        }

        //register the user
        const result = registerUser(username, email, password);
        //If registration is successful, log in the user and reload the page
        if(result.success)
        {
            loginUser(username, password);
            alert("Account created! Redirecting to dashboard...");
            window.location.href = '../../../index.html'; //Reload the page to reflect the logged-in state
        }else
            //Show an error message if registration fails
            alert("Error: " + result.message);
    })
}