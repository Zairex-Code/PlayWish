# 🎮 PlayWish - Didactic Guide & Project Workflow

Welcome to the PlayWish project! This document serves as the main guide for the entire team. Here we detail the architecture, how to set up the development environment, and the distribution of responsibilities.

## 🛠️ Technologies & Development Environment

This project is built without frameworks (Vanilla JS) but powered by modern tools for a better development experience and performance:
*   **Vite**: Fast development environment and bundler.
*   **Tailwind CSS**: Utility-first CSS framework for agile design.
*   **API**: RAWG Video Games Database.

### 📥 1. How to initialize the base project? (First time only - Daniel)
To configure the structural base (using Tailwind CSS v4+), run the following in the root of the empty repository:
```bash
npm create vite@latest . -- --template vanilla
npm install -D tailwindcss @tailwindcss/vite
```
*(Then configure Vite and import Tailwind in your main CSS file).*

**Vite Configuration (`vite.config.js`):**
Create the file and add:
```javascript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

**Main CSS (`style.css`):**
```css
@import "tailwindcss";
```

### 🚀 2. How to start working daily? (For the whole team)
Once the project skeleton is pushed to the `main` branch, any developer (Adrian, Dylan, or yourself on another PC) only needs to follow this standard process:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Zairex-Code/PlayWish.git
   cd PlayWish
   ```
2. **Install all referenced dependencies:**
   *(This reads package.json and downloads Vite, Tailwind, etc.)*
   ```bash
   npm install
   ```
3. **Start the local server with Hot Reload:**
   ```bash
   npm run dev
   ```
4. Open the URL (usually `http://localhost:5173`) in your browser. **You are ready to code!**

---

## 🎯 Architecture and System Requirements

PlayWish allows users to search and manage video games.

### 🕹️ Game Cards
The main unit of the project. Each card must visually detail:
*   Title
*   Genre
*   Release Date
*   Developer Studio
*   Price

### 📊 The Base Dashboard (Inspired by Lovable)
The Dashboard is always shown (whether the user is logged in or not).
*   **Navbar**: Logo (link to home), search type, recommendations, categories, global search input, wishlist, and login button.
*   **Genre Filters**: Tabs/buttons where the user can select a genre and see the most relevant games sorted by votes.
*   **Featured Search**: A striking central input.
*   **Mock Login**: Mandatory to save games to the Wishlist.
*   **Charts / Stats**:
    *   *Not logged in*: Views global data: "Live Trending" and "Top Score".
    *   *Logged in*: Also views local metrics: "Games Explored" and "Wishlisted".
*   **"Popular All Times" Carousel**: Globally acclaimed titles.
*   **Footer**: Social networks of the triumvirate collaborators.

---

## ⚔️ Role Assignment (The PlayWish Triumvirate)

To avoid stepping on each other's code, our team is strategically divided into three layers:

### 🧑‍💻 Dev 1: Adrian Matias - UI Architecture & Layout (The Layout Designer)
Responsible for translating the base design into code using HTML and Tailwind CSS.
*   **Feature 1**: Main skeleton (Navbar, Main Hero, and Footer).
*   **Feature 2**: Visual components of the 4 Dashboard cards (0 Games, 0 Wishlisted, Live Trending, etc.).
*   **Feature 3**: Carousel UI and construction of the **"Base Game Card"** that the others will use.

### 🧑‍💻 Dev 2: Dylan - Search Engine & RAWG API (The Postman)
The asynchronous wizard.
*   **Feature 1**: Configure validations and fetch requests to the RAWG API.
*   **Feature 2**: Search Engine functionality, including text capture (Debounce).
*   **Feature 3**: Inject API results directly by iterating the card built by Adrian.
*   **Feature 4**: Global Metrics (Data for "Live Trending" and "Top Score").

### 🧑‍💻 Dev 3: Daniel Enrique - State, Authentication & Data (The Guardian)
Pure logic and persistence (Backend simulation with LocalStorage).
*   **Feature 1**: Mock Authentication (Simple modal and validations in localStorage).
*   **Feature 2**: Core Wishlist logic paired with the active session.
*   **Feature 3**: Real-time statistics (Clicks on games and saved arrays).
*   **Feature 4**: Block buttons (Require login before adding items from Dylan's card).

---

## 🗺️ Our Git Workflow and Project Phases

It is **crucial** that each member uses **separate Git branches**. When a feature is completed, they will create a **Pull Request (PR)** to the main branch.

*   **🏁 Phase 0: The Foundation (Day 1 - United Team)**
    *   Create this repo, configure Vite environment, and incorporate Tailwind (Dark palette with cyan and purple).
*   **🧱 Phase 1: Static Screens (Days 2-4)**
    *   *Adrian*: Codes the appearance without data.
    *   *Dylan*: Does isolated tests with Postman.
    *   *Daniel*: Builds his initial database in memory/LocalStorage.
*   **⚙️ Phase 2: Injecting Life (Days 5-8)**
    *   *Adrian*: Adds mobile responsive design.
    *   *Dylan*: Applies his functions to the previously structured designs.
    *   *Daniel*: Implements registration on the UI button and starts counters.
*   **🧩 Phase 3: The Magnificent Merge (Days 9-11 - Together)**
    *   Technical resolution where branches meet. Conflict review.
*   **🚀 Phase 4: Polish & Deployment (Days 12-14)**
    *   Test critical cases (e.g., search for a non-existent game, add garbage to storage). Deploy to GitHub Pages or Vercel.