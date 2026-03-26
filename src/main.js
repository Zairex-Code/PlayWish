import './style.css';
import { 
  getTrendingGames, 
  getNewReleases, 
  getTopRated, 
  getComingSoon, 
  getPopularAllTimes,
  getGameDetails,
  getGenres, 
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
import modalDashboardHTML from './layouts/dashboard/modal.html?raw';
import { getCurrentUser, logoutUser } from './layouts/auth/auth-script';

let genresList = [];
let trendingNowList = [];
let newReleasesList = [];
let topRatedList= [];
let comingSoonList = [];
let popularAllTImesList = [];


const initApp = async () => {
  // Use Promise.all to fetch all data concurrently instead of sequentially
  [
    genresList, 
    trendingNowList, 
    newReleasesList, 
    topRatedList, 
    comingSoonList, 
    popularAllTImesList
  ] = await Promise.all([
    getGenres(),
    getTrendingGames(),
    getNewReleases(),
    getTopRated(),
    getComingSoon(),
    getPopularAllTimes()
  ]);

  return [genresList , trendingNowList , newReleasesList , topRatedList , comingSoonList , popularAllTImesList];
}




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
        <div class="snap-start shrink-0 w-70 bg-[#1a1d24] rounded-2xl overflow-hidden flex flex-col group hover:ring-2 hover:ring-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:-translate-y-2 hover:scale-105 duration-300 transition-all cursor-pointer" onclick="openGameModal(${game.id})" >
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

    const genreBadge1 = genre1 ? `<span class="  bg-cyan-400/50 text-gray-300 text-[10px] font-bold px-2.5  mr-4 py-1 rounded-full uppercase">${genre1}</span>` : '';
    const genreBadge2 = genre2 ? `<span class=" bg-cyan-400/50  text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">${genre2}</span>` : '';



    // 3. HTML Template (Injecting data with ${})
    return `
        <div class="w-full shrink-0 relative group/slide cursor-pointer">
                <img src="${game.background_image}" class="absolute inset-0 w-full h-full object-cover group-hover/slide:scale-105 transition-transform duration-1000 ease-out" alt="Cyberpunk 2077">
                <div class="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full transform translate-y-4 group-hover/slide:translate-y-0 transition-transform duration-500">
                    <span class="inline-block px-0 py-1 rounded-full text-xs font-bold gap-4 uppercase mb-3 backdrop-blur-sm">${genreBadge1}${genreBadge2}</span>
                    <h3 class="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">${game.name}</h3>
                    <p class="text-gray-300 max-w-2xl text-sm md:text-base opacity-0 group-hover/slide:opacity-100 transition-opacity duration-500 delay-100">${game.description}</p>
                </div>
            </div>
            `;
};

// ==========================================
// GENRE CARD TEMPLATE (The Factory)
// ==========================================
const createGenreCardHTML = (genre) => {
    return `
      <a href="#" class="snap-start shrink-0 group relative flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm w-40 h-24 p-4 overflow-hidden rounded-2xl border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20">
        <div class="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none">
          <img src="${genre.image_background}" class="w-full h-full object-cover" alt="${genre.name}">
        </div>
        <h3 class="relative text-white font-bold text-sm tracking-wide group-hover:text-cyan-400 transition-colors z-10">${genre.name}</h3>
      </a>
    `;
};


//Function to update the Navbar based on the user's login state
function initNavbarAuth(){
  const loginLink = document.getElementById('nav-login-link');
  const userProfileSection = document.getElementById('nav-user-profile');
  const usernameDisplay = document.getElementById('nav-username');
  const logoutBtn = document.getElementById('nav-logout-btn');
  
  const currentUser = getCurrentUser();

  if(currentUser){
    //If user is logged in, show the profile section and hide the login link
    if(loginLink) loginLink.classList.add('hidden');
    if (userProfileSection) {
        userProfileSection.classList.remove('hidden');
        userProfileSection.classList.add('flex');
      }
    if(usernameDisplay) usernameDisplay.textContent = currentUser;

    if(logoutBtn){
      const newLogoutBtn = logoutBtn.cloneNode(true); //Clone the button to remove old event listeners
      logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn); //Replace the old button with the new one
      newLogoutBtn.addEventListener('click', () => {
        logoutUser();
        alert('Logged out successfully. Redirecting to homepage...');
        window.location.href = '../../../index.html'; // Redirect to homepage after logout
      });
    }
  //If no user is logged in, show the login link and hide the profile section
  } else{
    if(loginLink) loginLink.classList.remove('hidden');
    if(userProfileSection){
      userProfileSection.classList.add('hidden');
      userProfileSection.classList.remove('flex');
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inject the Navbar (Render static UI first so user doesn't stare at blank screen)
  const navbarContainer = document.querySelector('.navbar-content');
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
    initNavbarAuth(); 
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

  // Fetch all API data concurrently AFTER the skeleton UI has been painted
  await initApp();
  const chartCardLogic = () => {
    
    const trendingCard = () => {
      // Note that we switch to document.getElementById because you used id="..." in the HTML
      const trendingCardBG = document.getElementById('trending-card-bg');
      const trendingCardTitle = document.getElementById('trending-card-title');
      const trendingCardScore = document.getElementById('trending-card-score');
  
      if(trendingNowList && trendingNowList.length > 0) {
          if(trendingCardTitle) trendingCardTitle.innerHTML = trendingNowList[0].name;
          if(trendingCardScore) trendingCardScore.innerHTML = trendingNowList[0].metacritic ? trendingNowList[0].metacritic : 'N/A';
          if(trendingCardBG) trendingCardBG.style.backgroundImage = `url('${trendingNowList[0].background_image}')`;
      }
    }
  

    const topRatedCard = () => {
      // Usar getElementById y asegurarnos de que tengan un ID en el HTML
      const topRatedCardBg = document.getElementById('top-rated-card-bg');
      const topRatedCardTitle = document.getElementById('top-rated-card-title');
      const topRatedCardScore = document.getElementById('top-rated-card-score');
      if(topRatedList && topRatedList.length > 0) {
        if(topRatedCardBg) topRatedCardBg.style.backgroundImage = `url('${topRatedList[0].background_image}')`;
        if(topRatedCardTitle) topRatedCardTitle.innerHTML = topRatedList[0].name;
        if(topRatedCardScore) topRatedCardScore.innerHTML = topRatedList[0].metacritic ? topRatedList[0].metacritic  : "N/A";
      }
      
    }

    const lastestDropCard = () => {
      // Usar getElementById y asegurarnos de que tengan un ID en el HTML
      const lastestDropBg = document.getElementById('lastest-drop-card-bg');
      const lastestDropTitle = document.getElementById('lastest-drop-card-title');
      const lastestDropScore = document.getElementById('lastest-drop-card-score');

      if(newReleasesList && newReleasesList.length > 0){
        // Usar background_image en lugar de image_background (que es exclusiva de Genres)
        if(lastestDropBg) lastestDropBg.style.backgroundImage = `url('${newReleasesList[0].background_image}')`  
        if(lastestDropTitle) lastestDropTitle.innerHTML = newReleasesList[0].name;
        if(lastestDropScore) lastestDropScore.innerHTML = newReleasesList[0].released ? `Released ${newReleasesList[0].released}` : "Release date TBA";
      }
    }

    // Ejecutar las funciones internas
    trendingCard();
    topRatedCard();
    lastestDropCard();
  }

  // Llamar la funcion principal contenedora sin intentar pasar las variables globales como funciones ()
  chartCardLogic();

  // 5. Main Dashboard Carousel Engine (Hero Jumbotron)
  // Re-structured to fetch data and only activate the arrows logic after finding it
  const setupDashboardCarousel = async (containerClass, carouselDashboardHTML, itemsList) => {
    const containerOfCarousel = document.querySelector(containerClass);
    if(containerOfCarousel) {
      // 5.1. Inject the static structure into the main container
      containerOfCarousel.innerHTML = carouselDashboardHTML;

      const track = document.getElementById('carousel-track');
      
      // 5.2. Verify that we have the container (track) and the function to request the games.
      if(track && itemsList){
        // Show a temporary text while fetching the rawg Json
        track.innerHTML = '<div class="flex items-center justify-center p-8 w-full"><p class="text-cyan-400 font-bold animate-pulse text-xl">Loading Hero Games...</p></div>';
        try{
          // 5.3. Wait to receive the games from DB 
          let games = popularAllTImesList;
          
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

  // 7. Engine For Bottom Horizontal Carousels (Trending, Top Rated, Genres)
  // These work with simple horizontal scrolling scrollby()
  // Now accepts an optional 'cardTemplateFactory' to know how to draw the items (Games or Genres)
  const setupHorizontalCarousel = async (containerClass, htmlContent, trackId, prevBtnId, nextBtnId, itemsList, cardTemplateFactory = createGameCardHTML) => {
    const container = document.querySelector(containerClass);
    if(container) {
      // 7.1. Inject initial structure
      container.innerHTML = htmlContent;

      const track = document.getElementById(trackId);
      const prevBtn = document.getElementById(prevBtnId);
      const nextBtn = document.getElementById(nextBtnId);
      
      // 7.2. Bring the info through the associated api function
      if(track && itemsList){
        track.innerHTML = '<div class="w-full flex justify-center py-8"><p class="text-cyan-400 font-bold animate-pulse text-xl">Loading data...</p></div>';

        try{

          //const fetchRequest = await fetchFunction();
          
          if (itemsList && itemsList.length > 0){
            // Use the injected factory function to build the cards (polymorphism)
            const cardsHTML = itemsList.map(item => cardTemplateFactory(item)).join('');
            track.innerHTML = cardsHTML;
          }else{
            track.innerHTML = '<p class="text-gray-500 p-4 w-full text-center">No results found for this section.</p>';
          }
        }catch(error) {
          track.innerHTML = '<p class="text-red-500 p-4 w-full text-center">Connection to Database lost. Please try again later.</p>';
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
  setupDashboardCarousel('.carousel-dashboard', carouselDashboardHTML, popularAllTImesList);

  // 8.2 Setup of Minor Carousels (Calling function 7 multiple times)
  setupHorizontalCarousel('.trending-carousel', trendingCarouselHTML, 'trending-track', 'trending-prev', 'trending-next', trendingNowList);
  setupHorizontalCarousel('.new-releases-carousel', newReleasesHTML, 'new-releases-track', 'new-releases-prev', 'new-releases-next', newReleasesList);
  setupHorizontalCarousel('.top-rated-carousel', topRatedHTML, 'top-rated-track', 'top-rated-prev', 'top-rated-next', topRatedList);
  setupHorizontalCarousel('.coming-soon-carousel', comingSoonHTML, 'coming-soon-track', 'coming-soon-prev', 'coming-soon-next', comingSoonList);
  setupHorizontalCarousel('.popular-all-times-carousel', popularAllTimesHTML, 'popular-track', 'popular-prev', 'popular-next', popularAllTImesList);


  // 8.3 Setup Genre Carousel (Using the generalized horizontal carousel engine)
  setupHorizontalCarousel('.genre-dashboard', genreDashboardHTML, 'genre-track', 'genre-prev', 'genre-next', genresList, createGenreCardHTML);

  //10. inject the universal modal
  const body = document.querySelector('body');
  if(body){
    body.insertAdjacentHTML('beforeend',modalDashboardHTML);
  }

  //11. modal logic
  const initModalLogic = () => {
    const backdrop = document.getElementById('game-modal-backdrop');
    const modalBox = document.getElementById('game-modal-box');
    const closeBtn = document.getElementById('close-modal-btn');
    if(!backdrop || !modalBox || !closeBtn) return;

    //function to open the modal
    window.openGameModal = async (gameId) => {

      // Remove 'hidden' so it exists in the layout, but keep opacity at 0
      backdrop.classList.remove('hidden');
      backdrop.classList.add('flex');

      //Small delay to allow CSS transitions to trigger (Fade in & Scale up)
      setTimeout(()=>{
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
      },10);

      // Target the content area and show a loading state
      const modalContent = document.getElementById('game-modal-content');
      modalContent.innerHTML = `
            <div class="h-64 flex items-center justify-center">
                <p class="text-cyan-400 font-bold animate-pulse">Loading classified data...</p>
            </div>
        `;
      try{
        // fetch exact game details
        const game = await getGameDetails(gameId);
        // clean up the date (RAWG sometimes sends HTML tags in description )
        const description = game.description_raw || "No description available for the moment"
        const score = game.metacritic ? `<span class="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-lg">Score: ${game.metacritic}</span>` : '';
        const devName = game.developers && game.developers.length > 0 ? game.developers[0].name : 'Unknown Developer';
        const releaseYear = game.released ? game.released.split('-')[0]: 'TBA';


        // Inject the rich HTML into the modal
        modalContent.innerHTML = `<div class="relative h-64 w-full">
                    <img src="${game.background_image}" alt="${game.name}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-linear-to-t from-[#1a1d24] via-[#1a1d24]/60 to-transparent"></div>
                    <div class="absolute bottom-4 left-6 flex items-center gap-3">
                        ${score}
                        <span class="text-gray-300 text-sm font-medium border border-gray-600 px-2 py-0.5 rounded-md">${releaseYear}</span>
                    </div>
                </div>
                
                <div class="p-6">
                    <h2 class="text-3xl font-extrabold text-white mb-2">${game.name}</h2>
                    <p class="text-cyan-400 text-sm font-bold mb-4 uppercase tracking-wider">By ${devName}</p>
                    
                    <div class="text-gray-400 text-sm leading-relaxed max-h-40 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                        ${description}
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors border border-gray-600">
                            Add to Wishlist
                        </button>
                        <a href="show.html?id=${game.id}" class="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold py-2 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center gap-2">
                            Show More
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </a>
                    </div>
                </div>
        `;

      }catch(error){
            modalContent.innerHTML = `
                <div class="h-64 flex items-center justify-center flex-col gap-2">
                    <p class="text-red-500 font-bold">Connection lost: " + error + ".</p>
                    <p class="text-gray-500 text-sm">Please close and try again.</p>
                </div>
            `;
      }
    };

    const closeModal = () =>{
      // Trigger the reverse animation (Fade out & Scale down)
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      modalBox.classList.remove('scale-100');
      modalBox.classList.add('scale-95');

      // wait for the animation to finish before hiding it completly
      setTimeout(() => {
        backdrop.classList.remove('flex');
        backdrop.classList.add('hidden');
      },300);
    }; 


    // Listeners to the close modal
    closeBtn.addEventListener('click', closeModal);

    //close if the user clicks exaactly on the dark background (outside the box)
    backdrop.addEventListener('click',(e) =>{
      if (e.target === backdrop) closeModal();
    });

    // close if the user presses the 'Escape' key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !backdrop.classList.contains('hidden')){
        closeModal();
      }

    });

  };

  // ==========================================
  // CAROUSEL BUTTON GENRE GENERATOR
  // ==========================================

  const createGenreCarousel = async () => {
    const genreContainer = document.querySelector('.genre-dashboard');
    if (genreContainer) {
      genreContainer.innerHTML = genreDashboardHTML;
      
      const track = document.getElementById('genre-track');
      const prevBtn = document.getElementById('genre-prev');
      const nextBtn = document.getElementById('genre-next');
      
      if (track) {
        track.innerHTML = '<div class="flex items-center justify-center w-full py-10"><p class="text-cyan-400 font-bold animate-pulse">Loading genres...</p></div>';
        try {
          
          if (genresList && genresList.length > 0) {
            track.innerHTML = genresList.map(genre => `
              <a href="#" class="snap-start shrink-0 group relative flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm w-40 h-24 p-4 overflow-hidden rounded-2xl border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/80 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20">
                <div class="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none">
                  <img src="${genre.image_background}" class="w-full h-full object-cover" alt="${genre.name}">
                </div>
                <h3 class="relative text-white font-bold text-sm tracking-wide group-hover:text-cyan-400 transition-colors z-10">${genre.name}</h3>
              </a>
            `).join('');

            if (prevBtn && nextBtn) {
              nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: 300, behavior: 'smooth' });
              });
              prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -300, behavior: 'smooth' });
              });
            }
          } else {
            track.innerHTML = '<p class="text-gray-500 p-4">No genres found.</p>';
          }
        } catch (error) {
          track.innerHTML = '<p class="text-red-500 p-4">Failed to load genres.</p>';
        }
      }
    }
  };


  // Start the modal logic
  initModalLogic();

  // Setup Genre Carousel
  createGenreCarousel();



});
