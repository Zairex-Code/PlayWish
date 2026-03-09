import './style.css'
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
  
  // 6. Inject the Trending Carousel
  const trendingContainer = document.querySelector('.trending-carousel');
  if(trendingContainer){
    trendingContainer.innerHTML = trendingCarouselHTML;
    
    // Basic Trending Carousel logic to scroll horizontally
    const trendTrack = document.getElementById('trend-track');
    const btnTrendPrev = document.getElementById('trend-prev');
    const btnTrendNext = document.getElementById('trend-next');
    
    if(trendTrack && btnTrendPrev && btnTrendNext) {
      btnTrendNext.addEventListener('click', () => {
        trendTrack.scrollBy({ left: 300, behavior: 'smooth' });
      });
      btnTrendPrev.addEventListener('click', () => {
        trendTrack.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }
  }

  // Helper function to setup horizontal scrolling carousels
  const setupHorizontalCarousel = (containerClass, htmlContent, trackId, prevBtnId, nextBtnId) => {
    const container = document.querySelector(containerClass);
    if(container) {
      container.innerHTML = htmlContent;
      const track = document.getElementById(trackId);
      const prevBtn = document.getElementById(prevBtnId);
      const nextBtn = document.getElementById(nextBtnId);
      
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
  setupHorizontalCarousel('.new-releases-carousel', newReleasesHTML, 'new-releases-track', 'new-releases-prev', 'new-releases-next');
  setupHorizontalCarousel('.top-rated-carousel', topRatedHTML, 'top-rated-track', 'top-rated-prev', 'top-rated-next');
  setupHorizontalCarousel('.coming-soon-carousel', comingSoonHTML, 'coming-soon-track', 'coming-soon-prev', 'coming-soon-next');
  setupHorizontalCarousel('.popular-all-times-carousel', popularAllTimesHTML, 'popular-track', 'popular-prev', 'popular-next');

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
