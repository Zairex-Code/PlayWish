import './style.css';
import { getGameDetails, getGameScreenshots, getGameMovies } from './api.js';
import navbarHTML from './layouts/dashboard/navbar.html?raw';
import { getCurrentUser, logoutUser } from './layouts/auth/auth-script';
// Initialize Navbar
function initNavbarAuth() {
  const loginLink = document.getElementById('nav-login-link');
  const userProfileSection = document.getElementById('nav-user-profile');
  const usernameDisplay = document.getElementById('nav-username');
  const logoutBtn = document.getElementById('nav-logout-btn');
  
  const currentUser = getCurrentUser();

  if(currentUser) {
    if(loginLink) loginLink.classList.add('hidden');
    if(userProfileSection) {
        userProfileSection.classList.remove('hidden');
        userProfileSection.classList.add('flex');
    }
    if(usernameDisplay) usernameDisplay.textContent = currentUser;

    if(logoutBtn) {
      const newLogoutBtn = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
      newLogoutBtn.addEventListener('click', () => {
        logoutUser();
        alert('Logged out successfully. Redirecting to homepage...');
        window.location.href = './index.html';
      });
    }
  } else {
    if(loginLink) loginLink.classList.remove('hidden');
    if(userProfileSection){
      userProfileSection.classList.add('hidden');
      userProfileSection.classList.remove('flex');
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Inject the Navbar
    const navbarContainer = document.querySelector('.navbar-content');
    if (navbarContainer) {
      navbarContainer.innerHTML = navbarHTML;
      initNavbarAuth(); 
    }

    const container = document.getElementById('game-details-container');
    
    // Get the game ID from the URL (e.g., show.html?id=3498)
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-[60vh] gap-4">
                <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h1 class="text-3xl font-bold text-white">SYSTEM ERROR</h1>
                <p class="text-gray-400">Target ID missing. Cannot retrieve intel.</p>
                <a href="index.html" class="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-colors">Return to Base</a>
            </div>
        `;
        return;
    }

    try {
        const [game, screenshots, movies] = await Promise.all([
            getGameDetails(gameId),
            getGameScreenshots(gameId),
            getGameMovies(gameId)
        ]);

        // Formatting data
        const releaseYear = game.released ? game.released.split('-')[0] : 'TBA';
        const fullDate = game.released ? new Date(game.released).toLocaleDateString('en-US', { disable: 'ignore', year: 'numeric', month: 'long', day: 'numeric'}) : 'Unknown Release Date';
        const rating = game.rating ? game.rating : 'N/A';
        const metacritic = game.metacritic ? `<div class="flex items-center gap-2 bg-[#1a1d24] border border-gray-700 px-4 py-2 rounded-xl shadow-lg"><span class="text-gray-400 text-sm font-medium">Metacritic</span><span class="bg-green-500 text-black text-sm font-extrabold px-2.5 py-0.5 rounded-md">${game.metacritic}</span></div>` : '';
        const playtime = game.playtime ? `<div class="flex items-center gap-2 bg-[#1a1d24] border border-gray-700 px-4 py-2 rounded-xl shadow-lg"><span class="text-gray-400 text-sm font-medium">Avg. Playtime</span><span class="text-white text-sm font-extrabold px-2.5 py-0.5">${game.playtime} hrs</span></div>` : '';
        
        const developers = game.developers ? game.developers.map(dev => dev.name).join(', ') : 'Unknown Developer';
        const publishers = game.publishers ? game.publishers.map(pub => pub.name).join(', ') : 'Unknown Publisher';
        
        const platforms = game.parent_platforms ? game.parent_platforms.map(p => `<span class="bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1 rounded-full border border-gray-600">${p.platform.name}</span>`).join('') : '';
        const genres = game.genres ? game.genres.map(g => `<span class="bg-cyan-900/30 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase border border-cyan-500/30">${g.name}</span>`).join('') : '';
        const genresPlain = game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A';
        const tags = game.tags ? game.tags.filter(t => t.language === 'eng').slice(0, 5).map(t => t.name).join(', ') : 'N/A';
        const esrbRating = game.esrb_rating ? game.esrb_rating.name : 'Not Rated';
        const esrbImage = game.esrb_rating ? `<span class="px-2 py-1 bg-white text-black font-extrabold text-xs rounded border-2 border-black">${esrbRating}</span>` : '';
        
        const websiteBtn = game.website ? `<a href="${game.website}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors border border-gray-600">Official Website</a>` : '';
        
        // Clean description 
        let descriptionHTML = game.description || 'No detailed description available.';

        // Build Media Gallery
        let mediaItems = [];
        
        // Add movies first
        if (movies && movies.length > 0) {
            movies.forEach(movie => {
                mediaItems.push(`
                    <div class="min-w-75 md:min-w-100 h-50 md:h-63 shrink-0 rounded-2xl overflow-hidden snap-center relative border border-gray-700 shadow-xl">
                        <video controls class="w-full h-full object-cover">
                            <source src="${movie.data?.max || movie.data?.['480']}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div class="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">TRAILER</div>
                    </div>
                `);
            });
        }

        // Add screenshots
        if (screenshots && screenshots.length > 0) {
            screenshots.forEach(screenshot => {
                if (screenshot.image !== game.background_image) {
                    mediaItems.push(`
                        <div class="min-w-75 md:min-w-100 h-50 md:h-63 shrink-0 rounded-2xl overflow-hidden snap-center group relative border border-gray-700 shadow-xl">
                            <img src="${screenshot.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Screenshot">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                            </div>
                        </div>
                    `);
                }
            });
        }
        
        let gallerySection = '';
        if (mediaItems.length > 0) {
            gallerySection = `
                <section class="mt-12 w-full max-w-full">
                    <h2 class="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                        <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Media Gallery
                    </h2>
                    
                    <div class="relative group mt-4">
                        <!-- Prev Button -->
                        <button id="btn-prev-media" class="absolute left-0 lg:-left-6 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-cyan-500 text-white hover:text-black rounded-full p-3 transition-colors opacity-0 group-hover:opacity-100 hidden md:block border border-gray-600 focus:outline-none shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>

                        <div id="media-track" class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth w-full pr-8">
                            ${mediaItems.join('')}
                        </div>

                        <!-- Next Button -->
                        <button id="btn-next-media" class="absolute right-0 lg:-right-6 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-cyan-500 text-white hover:text-black rounded-full p-3 transition-colors opacity-0 group-hover:opacity-100 hidden md:block border border-gray-600 focus:outline-none shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </section>
            `;
        }

        // Background Hero Section
        const html = `
            <!-- Hero Banner -->
            <div class="relative w-full h-[50vh] md:h-[70vh] flex items-end">
                <!-- Background Image & Gradients -->
                <div class="absolute inset-0 w-full h-full">
                    <img src="${game.background_image_additional || game.background_image}" class="w-full h-full object-cover object-top" alt="${game.name}">
                    <div class="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent"></div>
                    <div class="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent"></div>
                </div>

                <!-- Hero Content -->
                <div class="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 w-full">
                    <div class="flex flex-col md:flex-row gap-8 items-end">
                        
                        <!-- Game Cover (Using aspect-video so it doesn't crop the 16:9 images from RAWG) -->
                        <div class="hidden md:block w-80 aspect-video rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-gray-700 shrink-0 transform translate-y-8 bg-black">
                            <img src="${game.background_image}" class="w-full h-full object-cover" alt="Cover">
                        </div>

                        <!-- Main Info -->
                        <div class="grow flex flex-col gap-4">
                            <div class="flex flex-wrap gap-2 mb-2">
                                ${genres}
                            </div>
                            <h1 class="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-tight">${game.name}</h1>
                            <p class="text-xl md:text-2xl text-cyan-400 font-medium">${developers}</p>
                            
                            <!-- Badges -->
                            <div class="flex flex-wrap items-center gap-4 mt-4">
                                <div class="flex items-center gap-2 bg-[#1a1d24] border border-gray-700 px-4 py-2 rounded-xl shadow-lg">
                                    <svg class="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <span class="text-white text-lg font-bold">${rating} <span class="text-gray-500 text-sm">/ 5</span></span>
                                </div>
                                ${metacritic}
                                ${playtime}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- Detail Grid -->
            <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    <!-- Left Column: About & Requirements -->
                    <div class="lg:col-span-2 space-y-12">
                        <!-- About Section -->
                        <section>
                            <h2 class="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                                <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Mission Briefing (About)
                            </h2>
                            <div class="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-cyan-400 max-w-none text-lg">
                                ${descriptionHTML}
                            </div>
                        </section>

                        ${gallerySection}
                    </div>

                    <!-- Right Column: Meta Info & Actions -->
                    <div class="space-y-8 lg:transform lg:-translate-y-24 z-20 relative">
                        
                        <!-- Action Card -->
                        <div class="bg-[#1a1d24]/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-2xl sticky top-8">
                            <div class="flex flex-col xl:flex-row gap-4 mb-6">
                                <button class="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    Add to Wishlist
                                </button>
                                ${websiteBtn}
                            </div>

                            <div class="space-y-4">
                                <div class="flex justify-between items-center py-3 border-b border-gray-800">
                                    <span class="text-gray-400 font-medium">Release Date</span>
                                    <span class="text-white font-bold">${fullDate}</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-800">
                                    <span class="text-gray-400 font-medium">Developer</span>
                                    <span class="text-white font-bold text-right">${developers}</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-800">
                                    <span class="text-gray-400 font-medium">Publisher</span>
                                    <span class="text-white font-bold text-right">${publishers}</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-800">
                                    <span class="text-gray-400 font-medium">Genres</span>
                                    <span class="text-white font-bold text-right">${genresPlain}</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-800">
                                    <span class="text-gray-400 font-medium">Age Rating</span>
                                    <span class="text-white font-bold text-right">${esrbImage || esrbRating}</span>
                                </div>
                                <div class="flex justify-between items-center py-3 border-b border-gray-800">
                                    <span class="text-gray-400 font-medium">Tags</span>
                                    <span class="text-white font-bold text-right line-clamp-1 truncate w-[60%]" title="${tags}">${tags}</span>
                                </div>
                                <div class="flex flex-col py-3 gap-3">
                                    <span class="text-gray-400 font-medium">Supported Platforms</span>
                                    <div class="flex flex-wrap gap-2 justify-end">
                                        ${platforms}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        document.title = `${game.name} - PlayWish`;

        // Initialize Carousel Buttons
        const prevBtn = document.getElementById('btn-prev-media');
        const nextBtn = document.getElementById('btn-next-media');
        const track = document.getElementById('media-track');

        if(track) {
            if(prevBtn) {
                prevBtn.addEventListener('click', () => {
                    track.scrollBy({ left: -400, behavior: 'smooth' });
                });
            }
            if(nextBtn) {
                nextBtn.addEventListener('click', () => {
                    track.scrollBy({ left: 400, behavior: 'smooth' });
                });
            }
        }

    } catch (error) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-[60vh] gap-4">
                <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 class="text-3xl font-bold text-white">CONNECTION LOST</h1>
                <p class="text-gray-400">Failed to fetch data for ID: ${gameId}</p>
                <p class="text-gray-500 text-sm">${error.message}</p>
                <a href="index.html" class="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold rounded-lg transition-colors">Return to Base</a>
            </div>
        `;
    }
});