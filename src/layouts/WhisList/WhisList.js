import WishList from './ObjGlobalG.js';
import wishlistHTML from './WhisList.html?raw';

// ==========================================
// WISHLIST — Render Logic
// ==========================================

const formatDate = (date) => {
  if (!date) return 'unknown';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

const createWishCard = (game, onRemove) => {
  const card = document.createElement('div');
  card.className = [
    'bg-[#1a1d24] rounded-2xl overflow-hidden flex flex-col group',
    'border border-gray-800 hover:border-cyan-500/50',
    'hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(34,211,238,0.3)]',
    'transition-all duration-300 cursor-pointer'
  ].join(' ');

  card.innerHTML = `
    <div class="relative h-44 w-full overflow-hidden">
      <img
        src="${game.image || 'https://via.placeholder.com/400x200?text=No+Image'}"
        alt="${game.name}"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a1d24] via-transparent to-transparent"></div>

      <button
        class="remove-btn absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-1.5 rounded-lg
               opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/20"
        title="Remove from WishList"
      >
        <svg class="w-4 h-4 text-gray-400 hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="p-4 flex flex-col gap-2 flex-1">
      <h3 class="text-white font-bold text-lg truncate group-hover:text-cyan-400 transition-colors">
        ${game.name}
      </h3>

      <div class="flex items-center gap-1.5 text-gray-500 text-xs">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span>${game.released || 'TBA'}</span>
      </div>

      <div class="flex items-center gap-1.5 text-gray-700 text-[10px] mt-auto pt-2 border-t border-gray-800">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Added ${formatDate(game.updatedAt)}
      </div>
    </div>
  `;

  card.querySelector('.remove-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    onRemove(game.id, card);
  });

  return card;
};

// ── Función principal — todo corre DESPUÉS de inyectar el HTML ──
export const initWishList = () => {

  // 1. Inyectar HTML
  const wishlistContainer = document.querySelector('.wishlist-content');
  if (!wishlistContainer) return; // Si no existe el contenedor, salir
  wishlistContainer.innerHTML = wishlistHTML;

  // 2. Obtener referencias DESPUÉS de la inyección
  const grid       = document.getElementById('wl-grid');
  const emptyState = document.getElementById('wl-empty');
  const countBadge = document.getElementById('wl-count');

  if (!grid) return;

  // 3. Helpers
  const updateCount = () => {
    const total = WishList.getAll().length;
    if (countBadge) countBadge.textContent = `${total} game${total !== 1 ? 's' : ''}`;
  };

  const checkEmpty = () => {
    const isEmpty = WishList.getAll().length === 0;
    if (isEmpty) {
      emptyState?.classList.replace('hidden', 'flex');
      grid.classList.add('hidden');
    } else {
      emptyState?.classList.replace('flex', 'hidden');
      grid.classList.remove('hidden');
    }
  };

  const removeGame = (id, cardEl) => {
    cardEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    cardEl.style.opacity = '0';
    cardEl.style.transform = 'scale(0.9)';
    setTimeout(() => {
      WishList.remove(id);
      cardEl.remove();
      updateCount();
      checkEmpty();
    }, 300);
  };

  // 4. Render
  grid.innerHTML = '';
  WishList.getAll().forEach(game => {
    grid.appendChild(createWishCard(game, removeGame));
  });

  updateCount();
  checkEmpty();
};