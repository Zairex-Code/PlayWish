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
//  GAME CARD TEMPLATE (The Factory)
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

// ==========================================
// DASHBOARD CAROUSEL CARD TEMPLATE (The Factory)
// ==========================================
const createDashboardCarouselHTML = (game) => {
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
        <div class="w-full shrink-0 relative group/slide cursor-pointer">
                <img src="${game.background_image}" class="absolute inset-0 w-full h-full object-cover group-hover/slide:scale-105 transition-transform duration-1000 ease-out" alt="Cyberpunk 2077">
                <div class="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full transform translate-y-4 group-hover/slide:translate-y-0 transition-transform duration-500">
                    <span class="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-400 tracking-widest uppercase mb-3 backdrop-blur-sm">${genreBadge1}${genreBadge2}</span>
                    <h3 class="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">${game.name}</h3>
                    <p class="text-gray-300 max-w-2xl text-sm md:text-base opacity-0 group-hover/slide:opacity-100 transition-opacity duration-500 delay-100">${game.reviews_text_count}</p>
                </div>
            </div>
            `;
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

  // 5. Main Dashboard Carousel Engine (Hero Jumbotron)
  // Re-structured to fetch data and only activate the arrows logic after finding it
  const setupDashboardCarousel = async (containerClass, carouselDashboardHTML, fetchFunction) => {
    const containerOfCarousel = document.querySelector(containerClass);
    if(containerOfCarousel) {
      // 5.1. Inject the static structure into the main container
      containerOfCarousel.innerHTML = carouselDashboardHTML;

      const track = document.getElementById('carousel-track');
      
      // 5.2. Verify that we have the container (track) and the function to request the games.
      if(track && fetchFunction){
        // Show a temporary text while fetching the rawg Json
        track.innerHTML = '<div class="flex items-center justify-center p-8 w-full"><p class="text-cyan-400 font-bold animate-pulse text-xl">Loading Hero Games...</p></div>';
        try{
          // 5.3. Wait to receive the games from DB 
          let games = await fetchFunction();
          
          if (games && games.length > 0){
            // 5.4 Limit the maximum amount in the Main Hero to 5 games for better performance
            games = games.slice(0, 5);
            
            // 5.5 Build the cards using the factory(template strings) and insert them to the track
            const dashboardCarouselHTML = games.map(game => createDashboardCarouselHTML(game)).join('');
            track.innerHTML = dashboardCarouselHTML;

            // 5.6 NOW THAT THEY EXIST: Link the buttons and indexes passing the correct IDs.
            initMainCarouselLogic('carousel-track', 'btn-prev', 'btn-next', 'carousel-dots');

          } else {
            track.innerHTML = '<p class="text-gray-500 p-4">No games found for this section.</p>';
          }
        }catch(error) {
          track.innerHTML = '<p class="text-red-500 p-4">Failed to load games. Please try again later.</p>';
        }
      }
    } 
  };

  // 6. Internal Movement Logic (Controllers) for the Main Carousel
  const initMainCarouselLogic = (trackId, prevBtnId, nextBtnId, dotsContainerId) => {
    
    // 6.1 Identify DOM Components
    const track = document.getElementById(trackId);
    const btnPrev = document.getElementById(prevBtnId);
    const btnNext = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsContainerId);

    // Exit if there is no one (security)
    if (!track || !btnPrev || !btnNext || !dotsContainer) return;

    // 6.2 Define Carousel State Variables
    const totalSlides = track.children.length;
    if (totalSlides === 0) return;
    let currentIndex = 0;

    // 6.3 Dynamic creation of the Points (dots) using the amount of slides/games.
    // This prevents having three fixed points in HTML with five api images.
    dotsContainer.innerHTML = Array.from({length: totalSlides}).map((_, i) => 
      `<button class="w-3 h-3 rounded-full transition-all cursor-pointer ${i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-500/50 hover:bg-gray-400'}"></button>`
    ).join('');
    
    const dots = dotsContainer.querySelectorAll('button');

    // 6.4 Main Method: Moves the Div by Horizontal Transition and repaints the 'dots'
    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      // We actively paint the selected dot Cyan with shadow.
      dots.forEach((dot, index) => {
        if (index === currentIndex){
          dot.className = "w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all cursor-pointer";
        } else {
          dot.className = "w-3 h-3 rounded-full bg-gray-500/50 hover:bg-gray-400 transition-all cursor-pointer";
        }
      });
    };

    // 6.5 Advance to the right
    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    };

    // 6.6 Go back to the left
    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    };

    // 6.7 Attach Click events for Arrows
    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    // 6.8 Attach Click events for Dots to go to a direct slide.
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    // 6.9 Setup Auto-Play Interval every 5000ms
    let autoPlayInterval = setInterval(nextSlide, 5000);
    const carouselContainer = track.parentElement; // The relative container

    // Freeze autoplay when mouse hovers over looking to click.
    if(carouselContainer){
      carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
      carouselContainer.addEventListener('mouseleave', () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
      });
    }
  };

  // 7. Engine For Bottom Horizontal Carousels (Trending, Top Rated)
  // These work with simple horizontal scrolling scrollby()
  const setupHorizontalCarousel = async (containerClass, htmlContent, trackId, prevBtnId, nextBtnId, fetchFunction) => {
    const container = document.querySelector(containerClass);
    if(container) {
      // 7.1. Inject initial structure
      container.innerHTML = htmlContent;

      const track = document.getElementById(trackId);
      const prevBtn = document.getElementById(prevBtnId);
      const nextBtn = document.getElementById(nextBtnId);
      
      // 7.2. Bring the info through the associated api function
      if(track && fetchFunction){
        track.innerHTML = '<p class="text-gray-400 p-4 font-medium animate-pulse">Loading games from RAWG...</p>';
        try{
          const games = await fetchFunction();
          if (games && games.length>0){
            // We use join('') to fuse all in a string and inject
            const cardsHTML = games.map(game => createGameCardHTML(game)).join('');
            track.innerHTML = cardsHTML;
          }else{
            track.innerHTML = '<p class="text-gray-500 p-4">No games found for this section.</p>';
          }
        }catch(error) {
          track.innerHTML = '<p class="text-red-500 p-4">Failed to load games. Please try again later.</p>';
        }
      }

      // 7.3. Scroll functionality so it reacts to the click
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

  // 8. Initialization of All Application Carousels
  
  // 8.1 Setup Main Hero Carousel (Calling functions 5 and 6 internally)
  setupDashboardCarousel('.carousel-dashboard', carouselDashboardHTML, getTrendingGames);

  // 8.2 Setup of Minor Carousels (Calling function 7 multiple times)
  setupHorizontalCarousel('.trending-carousel', trendingCarouselHTML, 'trending-track', 'trending-prev', 'trending-next', getTrendingGames);
  setupHorizontalCarousel('.new-releases-carousel', newReleasesHTML, 'new-releases-track', 'new-releases-prev', 'new-releases-next', getNewReleases);
  setupHorizontalCarousel('.top-rated-carousel', topRatedHTML, 'top-rated-track', 'top-rated-prev', 'top-rated-next', getTopRated);
  setupHorizontalCarousel('.coming-soon-carousel', comingSoonHTML, 'coming-soon-track', 'coming-soon-prev', 'coming-soon-next', getComingSoon);
  setupHorizontalCarousel('.popular-all-times-carousel', popularAllTimesHTML, 'popular-track', 'popular-prev', 'popular-next', getPopularAllTimes);
  
  // 9. Inject the Browse by Genre
  const genreContainer = document.querySelector('.genre-dashboard');
  if(genreContainer){
    genreContainer.innerHTML = genreDashboardHTML;
  }

});
