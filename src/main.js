import './style.css';
import { 
  getTrendingGames, 
  getNewReleases, 
  getTopRated, 
  getComingSoon, 
  getPopularAllTimes 
} from './api.js';
import navbarHTML from './layouts/dashboard/navbar.html?raw';
import backgroundDashboardHTML from './layouts/dashboard/background-dashboard.html?raw';
import jumbotronHTML from './layouts/dashboard/jumbotron-dashboard.html?raw';
import chartCardsHTML from './layouts/dashboard/chart-cards.html?raw';
import carouselDashboardHTML from './layouts/dashboard/carousel-dashboard.html?raw';
import trendingCarouselHTML from './layouts/dashboard/trendingCarousel.html?raw';
import newReleasesHTML from './layouts/dashboard/newReleasesCarousel.html?raw';
import topRatedHTML from './layouts/dashboard/topRatedCarousel.html?raw';
import comingSoonHTML from './layouts/dashboard/comingSoonCarousel.html?raw';
import popularAllTimesHTML from './layouts/dashboard/popularAllTimesCarousel.html?raw';
import genreDashboardHTML from './layouts/dashboard/Genre-dashboard.html?raw';

// ==========================================
// 🏭 GAME CARD TEMPLATE (The Factory)
// ==========================================
const createGameCardHTML = (game) => {
    // 1. Data cleaning (Quality Control)
    // RAWG sometimes omits Metacritic, so we provide a fallback 'N/A'
    const score = game.metacritic ? game.metacritic : 'N/A'; 
    
    // Extract the year from the release date (e.g., "2024-02-15" -> "2024")
    const year = game.released ? game.released.split('-')[0] : 'TBA';

    // 2. Extract first and second genres if they exist
    const genre1 = game.genres && game.genres[0] ? game.genres[0].name : 'Game';
    const genre2 = game.genres && game.genres[1] ? game.genres[1].name : '';

    const genreBadge1 = genre1 ? `<span class="bg-black/60 text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">${genre1}</span>` : '';
    const genreBadge2 = genre2 ? `<span class="bg-black/60 text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">${genre2}</span>` : '';



    // 3. HTML Template (Injecting data with ${})
    return `
        <div class="snap-start shrink-0 w-70 bg-[#1a1d24] rounded-2xl overflow-hidden flex flex-col group hover:ring-2 hover:ring-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:-translate-y-2 hover:scale-105 duration-300 transition-all cursor-pointer">
            <div class="relative h-44 w-full overflow-hidden">
                <img src="${game.background_image}" alt="${game.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out">
                <div class="absolute inset-0 bg-linear-to-t from-[#1a1d24] via-transparent to-transparent"></div>
                
                <div class="absolute top-3 right-3 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-lg">
                    ${score}
                </div>
                
                <div class="absolute bottom-3 left-3 flex gap-2">
                    
                    ${genreBadge1}
                    ${genreBadge2}
                </div>
            </div>
            
            <div class="p-4 flex flex-col gap-3">
                <h3 class="text-white font-bold text-lg truncate group-hover:text-cyan-400 transition-colors">${game.name}</h3>
                
                <div class="flex justify-between items-center text-gray-400 text-sm font-medium">
                    <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>${year}</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-yellow-500">
                        <span>${game.rating}</span>
                        <svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    </div>
                </div>
            </div>
        </div>`;
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject the Navbar
  const navbarContainer = document.querySelector('.navbar-content');
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
  }

  // 2. Inject the Background Dashboard
  const BackGroundContainer = document.querySelector('.background-dashboard');
  if (BackGroundContainer){
    BackGroundContainer.innerHTML = backgroundDashboardHTML;
  }

  // 3. Inject the Jumbotron Component
  const jumbotronContainer = document.querySelector('.jumbotron-dashboard');
  if(jumbotronContainer){
    jumbotronContainer.innerHTML = jumbotronHTML;
  }

  // 4. Inject the Chart Cards
  const chartCardContainer = document.querySelector('.chart-cards')
  if(chartCardContainer){
    chartCardContainer.innerHTML = chartCardsHTML;
  }

  // 5. Inject the Carousel Dashboard
  const containerOfCarousel = document.querySelector('.carousel-dashboard');
  if(containerOfCarousel){
    containerOfCarousel.innerHTML = carouselDashboardHTML;
  }
  
 

  // Helper function to setup horizontal scrolling carousels
  const setupHorizontalCarousel = async (containerClass, htmlContent, trackId, prevBtnId, nextBtnId, fetchFunction) => {
    const container = document.querySelector(containerClass);
    if(container) {
      // 1.  We inject the visual skeleton 
      container.innerHTML = htmlContent;

      const track = document.getElementById(trackId);
      const prevBtn = document.getElementById(prevBtnId);
      const nextBtn = document.getElementById(nextBtnId);
      
      // 2. Fetch and inject real data if a fetch function was provided
      if(track && fetchFunction){
        // Show a temporary loading message
        track.innerHTML = '<p class="text-gray-400 p-4 font-medium animate-pulse">Loading games from RAWG...</p>';
        try{
          // Call the cef Dispatcher and wait for the games
          const games = await fetchFunction();
          if (games && games.length>0){
            // Pass games through the factory template and merge them into a single HTML string
            const cardsHTML = games.map(game => createGameCardHTML(game)).join('');
            track.innerHTML = cardsHTML; //Put the finished cards on the shelf

          }else{
            track.innerHTML = '<p class="text-gray-500 p-4">No games found for this section.</p>';
          }
        }catch(error) {
          track.innerHTML = '<p class="text-red-500 p-4">Failed to load games. Please try again later.</p>';
        }
      }

      if(track && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
          track.scrollBy({ left: 300, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
          track.scrollBy({ left: -300, behavior: 'smooth' });
        });
      }
    } 
  };

  // Inject additional carousels
  setupHorizontalCarousel('.trending-carousel', trendingCarouselHTML, 'trending-track', 'trending-prev', 'trending-next', getTrendingGames);
  setupHorizontalCarousel('.new-releases-carousel', newReleasesHTML, 'new-releases-track', 'new-releases-prev', 'new-releases-next', getNewReleases);
  setupHorizontalCarousel('.top-rated-carousel', topRatedHTML, 'top-rated-track', 'top-rated-prev', 'top-rated-next', getTopRated);
  setupHorizontalCarousel('.coming-soon-carousel', comingSoonHTML, 'coming-soon-track', 'coming-soon-prev', 'coming-soon-next', getComingSoon);
  setupHorizontalCarousel('.popular-all-times-carousel', popularAllTimesHTML, 'popular-track', 'popular-prev', 'popular-next', getPopularAllTimes);

  // 7. Inject the Browse by Genre
  const genreContainer = document.querySelector('.genre-dashboard');
  if(genreContainer){
    genreContainer.innerHTML = genreDashboardHTML;
  }

  // 8. Main Carousel Logic - DOM Elements & State
  const track = document.getElementById('carousel-track');
  if (track) {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const dots = document.querySelectorAll('#carousel-dots button');

    // Select the parent container for the pause/resume hover events
    const carouselContainer = track.parentElement;

    // Initialize carousel state
    let currentIndex = 0;
    const totalSlides = track.children.length;

    // Update the Carousel UI (track position and active dot highlight)
    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        if (index === currentIndex){
          dot.className = "w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all";
        } else {
          dot.className = "w-3 h-3 rounded-full bg-gray-500/50 transition-all";
        }
      });
    };

    // Move to the next slide logically
    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    };

    // Move to the previous slide logically
    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalSlides ) % totalSlides;
      updateCarousel();
    };

    // Attach Event Listeners for navigation buttons
    if(btnNext) btnNext.addEventListener('click', nextSlide);
    if(btnPrev) btnPrev.addEventListener('click', prevSlide);

    // Attach Event Listeners for direct dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    // Auto-Play feature: changes slide automatically every 3 seconds
    let autoPlayInterval = setInterval(nextSlide, 3000);

    // Pause auto-play when hovering over the carousel, resume when leaving
    if(carouselContainer){
      carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      carouselContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 3000);
      });
    }
  }

});
