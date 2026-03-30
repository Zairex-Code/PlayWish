import wishLits from './layouts/WhisList/WhisList.html?raw';
import { initWishList } from './layouts/WhisList/WhisList.js';

const divMain = document.querySelector('main');

document.addEventListener('click', (event) => {
    const btn = event.target.closest('#nav-wishlist-btn');
    if (btn) {
         divMain.innerHTML = '<div class="wishlist-content"></div>'
        initWishList();
    }
});
