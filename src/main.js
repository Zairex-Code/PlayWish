import './style.css'
import navbarHTML from './layouts/navbar.html?raw'; // vite brings HTML Files as strings only adding "?raw"
import backgroundDashboardHTML from './layouts/background-dashboard.html?raw';


document.addEventListener('DOMContentLoaded', () => {
  //1. Inject the navbar

  // We search for the container by its class (class="navbar-content" in index.html)
  const navbarContainer = document.querySelector('.navbar-content');

  // If the container exists on the current page, we inject the HTML inside it
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
  }

  // 2. inject the background image
  // We search for the container by its class (class="background-dashboard" in index.html)
  const BackGroundContainer = document.querySelector('.background-dashboard');
  // If the container exists on the current page, we inject the HTML inside it
  if (BackGroundContainer){
    BackGroundContainer.innerHTML = backgroundDashboardHTML;
  }
});
