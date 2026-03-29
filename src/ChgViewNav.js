import wishLits from './layouts/WhisList/WhisList.html?raw';

const divMain = document.querySelector('main');

document.addEventListener('click', (event) => {
    const btn = event.target.closest('#nav-wishlist-btn');
    if (btn) divMain.innerHTML = wishLits;
});