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