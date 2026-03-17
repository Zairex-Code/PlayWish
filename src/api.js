// Define the base URL and API key from environment variables (Vite setup)
const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = import.meta.env.VITE_RAWG_API_KEY; 

/**
 * Base function to fetch data from the RAWG API
 * @param {string} endpoint - The specific API endpoint (e.g., '/games', '/genres')
 * @param {string} params - Extra query parameters (e.g., '&ordering=-rating')
 * @returns {Promise<Array>} - Returns an array of results or an empty array if it fails
 */
const fetchFromAPI = async (endpoint, params = '') => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?key=${API_KEY}${params}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results; // RAWG returns the array of items inside the "results" property
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
};

// ---------------------------------------------------------
// Date Helpers (RAWG requires the YYYY-MM-DD format)
// ---------------------------------------------------------
const today = new Date().toISOString().split('T')[0];

const lastMonthObj = new Date();
lastMonthObj.setMonth(lastMonthObj.getMonth() - 1);
const lastMonth = lastMonthObj.toISOString().split('T')[0];

const nextYearObj = new Date();
nextYearObj.setFullYear(nextYearObj.getFullYear() + 1);
const nextYear = nextYearObj.toISOString().split('T')[0];

// ---------------------------------------------------------
// Specific Services / Endpoints for the dashboard sections
// ---------------------------------------------------------

// 1. Trending Now (Recently popular)
export const getTrendingGames = () => {
    // Filter games from the last month, ordered by popularity (-added)
    return fetchFromAPI('/games', `&dates=${lastMonth},${today}&ordering=-added&page_size=10`);
};

// 2. New Releases
export const getNewReleases = () => {
    // Games released exactly within the last month
    return fetchFromAPI('/games', `&dates=${lastMonth},${today}&ordering=-released&page_size=10`);
};

// 3. Top Rated
export const getTopRated = () => {
    // Games with the highest Metacritic score
    return fetchFromAPI('/games', `&ordering=-metacritic&page_size=10`);
};

// 4. Coming Soon
export const getComingSoon = () => {
    // Future releases ordered by release date
    return fetchFromAPI('/games', `&dates=${today},${nextYear}&ordering=released&page_size=10`);
};

// 5. Popular All Times
export const getPopularAllTimes = () => {
    // All-time most added games in RAWG user libraries
    return fetchFromAPI('/games', `&ordering=-added&page_size=10`); 
};

// 6. Get Genres List
export const getGenres = () => {
    return fetchFromAPI('/genres');
};

// 7. Game Search Engine (For the Navbar)
export const searchGames = (query) => {
    // Search games by name and return the top 10 results
    return fetchFromAPI('/games', `&search=${query}&page_size=10`);
};


// 8 get Specifictç Game Details (for the modal)
export const getGameDetails = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching game details for ID ${id}:`, error);
        throw error;
    }
}
