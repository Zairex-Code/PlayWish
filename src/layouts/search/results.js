//src/layouts/search/results.js
import { initNavbarAuth, getCurrentUser } from '../auth/auth-script.js';
import navbarHTML from '../dashboard/navbar.html?raw';
import { initNavbarSearch, initSearchEngine } from './search.js';
document.addEventListener('DOMContentLoaded', () => {
    // Navbar Injection
   const navbarContainer = document.querySelector('.navbar-content');
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
        initNavbarAuth(); 
        initNavbarSearch();
    }

    //get query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const searchType = urlParams.get('type') || 'name';

    //Inizialize the search input with the query parameter
    if(query){
        document.getElementById('results-query-display').textContent = query;
        performanceDetailedSearch(query, searchType);
    } else
        document.getElementById('results-grid').innerHTML = `<p class="text-red-400 text-center py-20">Error: No search term found. Please try again.</p>`;
});

//Function to render the detailed search results page
async function performanceDetailedSearch(query, searchType) {
    const resultsGrid = document.getElementById('results-grid');
    const resultsLoading = document.getElementById('results-loading');

    const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
    if (!API_KEY) {
        console.error("No API KEY found.");
        resultsGrid.innerHTML = `<p class="text-red-400 text-center py-20">Error: No API KEY configured. Please try again.</p>`;
        return;
    }

    resultsLoading.classList.remove('hidden');
    resultsGrid.innerHTML = '';
    // Make the API call to RAWG to fetch games based on the search query
    try {
        const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=12&ordering=-metacritic`; 
        const res = await fetch(url);
        if(!res.ok) throw new Error("Error fetching data from RAWG API");
        const data = await res.json();
        const games = data.results;

        resultsLoading.classList.add('hidden');
        
        if(!games || games.length === 0){
            resultsGrid.innerHTML = `<p class="text-gray-400 text-center py-20">No results found for "${query}". Please try a different search term.</p>`;
            return;
        }

        games.forEach(game => {
            const metaColor = game.metacritic >= 80 ? 'text-green-500' : game.metacritic >= 60 ? 'text-yellow-500' : game.metacritic >= 30 ? 'text-red-500' : 'text-gray-500';
            const card = `
                <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all group flex flex-col relative">
                    <div class="relative h-48 overflow-hidden">
                        <img src="${game.background_image || 'https://via.placeholder.com/400x200'}" alt="${game.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                    </div>
                    
                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="font-bold text-white text-lg mb-2 truncate" title="${game.name}">${game.name}</h3>
                        
                        <div class="flex flex-wrap gap-2 text-xs text-gray-400 mb-2">
                            <span>Released: ${game.released || 'TBA'}</span>
                            <span>Genres: ${game.genres.map(g => g.name).slice(0, 2).join(', ') || 'TBA'}</span>
                            <span>Studio: ${game.developer_name || 'Gamer'}</span>
                        </div>

                        ${game.metacritic ? `<span class="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-md border border-gray-700 bg-gray-900/80 ${metaColor}">${game.metacritic}</span>` : ''}

                        <div class="text-sm font-medium text-gray-300 mt-2 mb-4">Price: <span class="text-cyan-400">$ 29.99</span></div>

                        <button class="mt-auto w-full bg-cyan-400 hover:bg-cyan-500 text-blue-950 text-sm font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path></svg>
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            `;
            resultsGrid.insertAdjacentHTML('beforeend', card);
        });

    } catch (error) {
        console.error(error);
        resultsLoading.classList.add('hidden');
        resultsGrid.innerHTML = `<p class="text-red-400 text-center py-20 col-span-full">Error connecting to the detailed search database.</p>`;
    }
        
}