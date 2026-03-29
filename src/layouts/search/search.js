// src/layouts/search/search.js
// Logic to handle the search modal and search engine functionality

export function initSearchEngine() {
    // 1. Select ALL search inputs (Navbar and Jumbotron) using the new class
    const searchInputs = document.querySelectorAll('.pw-search-input');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const searchResultsGrid = document.getElementById('search-results-grid');
    const searchLoading = document.getElementById('search-loading');
    const viewAllContainer = document.getElementById('view-all-results-container');
    const viewAllBtn = document.getElementById('view-all-results-btn');
    const queryDisplay = document.getElementById('search-query-display');

    // Check if the essential elements are present in the DOM
    if(searchInputs.length === 0 || !searchModal){
        console.warn('Search inputs or modal not found in the DOM');
        return;
    }

    // Debounced search function to limit API calls while typing
    function debounce(func, delay) {
        let timeoutId;
        return function (...args){
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // 🚀 NEW FUNCTION: Physically moves the modal to the active input's container
    const attachModalToActiveInput = (activeInput) => {
        const wrapper = activeInput.closest('.pw-search-wrapper');
        // If the modal isn't already inside this wrapper, move it
        if (wrapper && searchModal.parentElement !== wrapper) {
            // Ensure it hangs correctly from the current wrapper
            searchModal.classList.add('absolute', 'top-full', 'left-0', 'w-full', 'z-50', 'mt-1');
            wrapper.appendChild(searchModal);
        }
    };

    // Function to quickly fetch search results from the API
    function renderQuickResults(games, query, searchType){
        searchLoading.classList.add('hidden');
        searchResultsGrid.innerHTML = '';

        if(!games || games.length === 0){
            searchResultsGrid.innerHTML = `<p class="text-gray-400 p-4 text-center">No results found for "${query}"</p>`;
            viewAllContainer.classList.add('hidden');
            return;
        }

        // Get the top 4 results to display in the quick search dropdown
        const topGames = games.slice(0, 4);

        topGames.forEach(game => {
            const metaColor = game.metacritic >= 80 ? 'text-green-500' : game.metacritic >= 60 ? 'text-yellow-500' : game.metacritic >= 30 ? 'text-red-500' : 'text-gray-500';
            
            // Steam-style horizontal row design
            const card = `
                <div class="flex items-center gap-4 p-2 hover:bg-[#3d4450] cursor-pointer transition-colors border-b border-gray-800/50 last:border-0 group" onclick="window.openGameModal(${game.id})">
                    <img src="${game.background_image || 'https://via.placeholder.com/120x60'}" alt="${game.name}" class="w-24 h-12 object-cover shadow-md rounded">
                    
                    <div class="flex-grow flex justify-between items-center pr-2">
                        <div class="flex flex-col">
                            <h3 class="font-medium text-gray-200 text-sm group-hover:text-white transition-colors">${game.name}</h3>
                            <span class="text-xs text-gray-500">${game.released ? game.released.split('-')[0] : 'TBA'}</span>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            ${game.metacritic ? `<span class="text-[10px] font-bold px-1.5 py-0.5 bg-gray-900 rounded ${metaColor}">${game.metacritic}</span>` : ''}
                            <span class="text-xs text-gray-300">S/. </span>
                        </div>
                    </div>
                </div>
            `;
            searchResultsGrid.insertAdjacentHTML('beforeend', card);
        });

        if(games.length > 0){
            viewAllContainer.classList.remove('hidden');
            queryDisplay.textContent = query;
            viewAllBtn.href = `./src/layouts/search/results.html?q=${encodeURIComponent(query)}&type=${searchType}`;
        }
    }

    // Perform Search (Now receives the activeInput parameter)
    const performSearch = async (query, activeInput) => {
        if(!query.trim()){
            searchModal.classList.add('hidden');
            searchModal.classList.remove('flex');
            return;
        }

        // Teleport the modal to the correct input before showing it
        attachModalToActiveInput(activeInput);
        
        searchModal.classList.remove('hidden');
        searchModal.classList.add('flex'); // Using flex so flex-col works correctly
        searchLoading.classList.remove('hidden');
        searchResultsGrid.innerHTML = '';
        viewAllContainer.classList.add('hidden');

        try {
            const searchType = window.playwishSearchType || 'name';
            
            // Calling the API key from the environment variables
            const API_KEY = import.meta.env.VITE_RAWG_API_KEY; 

            // Check if the API key is present
            if(!API_KEY){
                console.error("Missing VITE_RAWG_API_KEY in the .env file");
                searchLoading.classList.add('hidden');
                searchResultsGrid.innerHTML = `<p class="text-red-400 text-center py-4">API configuration error.</p>`;
                return;
            }

            // Make the API call to RAWG
            let url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${query}&page_size=10`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error("Error in RAWG API response");
            
            const data = await response.json();

            // Render the quick results
            renderQuickResults(data.results, query, searchType);

        } catch (error) {
            console.error(error);
            searchLoading.classList.add('hidden');
            searchResultsGrid.innerHTML = `<p class="text-red-400 text-center py-4">Error connecting to the database.</p>`;
        }
    };

    // Apply the event listeners to EVERY search input on the page
    searchInputs.forEach(input => {
        const debouncedSearch = debounce((e) => {
            performSearch(e.target.value, e.target);
        }, 500);

        input.addEventListener('input', debouncedSearch);

        // If the user focuses on the input and it already has text, show the modal there
        input.addEventListener('focus', (e) => {
            if (e.target.value.trim().length > 0) {
                attachModalToActiveInput(e.target);
                searchModal.classList.remove('hidden');
                searchModal.classList.add('flex');
            }
        });
    });

    // Smart logic to close the dropdown when clicking outside
    document.addEventListener('click', (e) => {
        // Check if we clicked inside ANY search wrapper or inside the modal itself
        const isClickInsideWrapper = e.target.closest('.pw-search-wrapper');
        if (!isClickInsideWrapper && !searchModal.contains(e.target)) {
            searchModal.classList.add('hidden');
            searchModal.classList.remove('flex');
        }
    });

    // Close button logic (if you still have the "X" button in the modal)
    if(closeSearchBtn) {
        closeSearchBtn.addEventListener('click', () => {
            searchModal.classList.add('hidden');
            searchModal.classList.remove('flex');
        });
    }
}

// Dropdown Menu Logic for Navbar Search Type
export function initNavbarSearch() {
    const dropdownBtn = document.getElementById('dropdownDividerButton');
    const dropdownMenu = document.getElementById('dropdownDivider');
    
    // Select all inputs so we can update the placeholder on all of them
    const searchInputs = document.querySelectorAll('.pw-search-input'); 
    const options = document.querySelectorAll('.search-option');

    window.playwishSearchType = 'name'; 

    if (!dropdownBtn || !dropdownMenu) return;

    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        dropdownMenu.classList.toggle('hidden');
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault(); 
            const type = option.getAttribute('data-search-type');
            const visibleText = option.textContent;

            window.playwishSearchType = type;

            dropdownBtn.innerHTML = `
                ${visibleText} 
                <svg class="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
            `;

            // Update placeholder on all search inputs dynamically
            searchInputs.forEach(input => {
                input.placeholder = `Search ${visibleText.toLowerCase()}...`;
            });

            dropdownMenu.classList.add('hidden');
        });
    });

    document.addEventListener('click', (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });
}