//This is the script for the auth layout, 
//it will be used to handle the login and register forms,
//and also to handle the authentication process with the Tocken Local Storage.
const auth = {
    //This key will be used to store the user session in the local storage,
    //it will be used to check if the user is logged in or not
    key : 'user_session',

    //Save the user in the local storage,
    //it will be called after a successful login or registration
    save(user){
        localStorage.setItem(this.key, JSON.stringify(user));
    },

    //Get the user from the local storage,
    //it will be used to check if the user is logged in or not
    get(){
        const data = localStorage.getItem(this.key);
        if(data) return JSON.parse(data);
        return null;
    },

    //Remove the user from the local storage,
    //it will be called when the user logs out
    remove(){
        localStorage.removeItem(this.key);
        location.reload();
    }
}