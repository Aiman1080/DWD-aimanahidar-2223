const apiKeyOMDb = 'ec403095';

const searchForm = document.getElementById('form');
const searchInput = document.getElementById('input');
const movieList = document.getElementById('list');
const randomButton = document.getElementById('random-button');

const filterGenreSelect = document.getElementById('filter-genre');
const filterAwardsCheckbox = document.getElementById('filter-awards');
const filterTypeSelect = document.getElementById('filter-type');
const filterYearInput = document.getElementById('filter-year');

async function getMoviesBySearch(searchQuery, genreFilter, awardsFilter, typeFilter, yearFilter) {
  let apiUrl = `http://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKeyOMDb}`;

  if (genreFilter) {
    apiUrl += `&genre=${encodeURIComponent(genreFilter)}`;
  }

  if (awardsFilter) {
    apiUrl += '&awards=true';
  }

  if (typeFilter) {
    apiUrl += `&type=${encodeURIComponent(typeFilter)}`;
  }

  if (yearFilter) {
    apiUrl += `&y=${encodeURIComponent(yearFilter)}`;
  }

  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.Search || [];
}

async function getRandomMovies() {
  const randomKeywords = ['movie', 'film'];
  const randomSearch = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
  const movies = await getMoviesBySearch(randomSearch);
  return [...movies];
}

async function displayRandomMovies() {
  const randomMovies = await getRandomMovies();
  const moviesToDisplay = randomMovies.slice(0, 15);
  displayMovies(moviesToDisplay);
}

async function getMovieDetails(movieId) {
  const apiUrl = `http://www.omdbapi.com/?i=${movieId}&apikey=${apiKeyOMDb}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

async function displayMovies(movies) {
  movieList.innerHTML = '';

  for (const movie of movies) {
    const movieDetails = await getMovieDetails(movie.imdbID);

    if (movieDetails) {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.dataset.imdbId = movie.imdbID;
      movieCard.innerHTML = `
        <h2>${movieDetails.Title}</h2>
        <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
        <p>Genre: ${movieDetails.Genre}</p>
        <p>Director: ${movieDetails.Director}</p>
        <p>Release Date: ${movieDetails.Released}</p>
        <button class="like-button">Like</button>
        <button class="watch-later-button">À regarder</button>
      `;
      movieList.appendChild(movieCard);
    }
  }
}

async function searchMovies(event) {
  event.preventDefault();
  const searchQuery = searchInput.value;
  const genreFilter = filterGenreSelect.value;
  const awardsFilter = filterAwardsCheckbox.checked;
  const typeFilter = filterTypeSelect.value;
  const yearFilter = filterYearInput.value;

  const movies = await getMoviesBySearch(searchQuery, genreFilter, awardsFilter, typeFilter, yearFilter);
  displayMovies(movies);

  fillGenreSelect();
}

filterGenreSelect.addEventListener('change', searchMovies);

function showFilterOptions() {
  const filterOptionsContainer = document.getElementById('filter-options');
  filterOptionsContainer.style.display = 'block';
}

function hideFilterOptions() {
  const filterOptionsContainer = document.getElementById('filter-options');
  filterOptionsContainer.style.display = 'none';
}

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  searchMovies(event);
  showFilterOptions();
});

randomButton.addEventListener('click', function(event) {
  event.preventDefault();
  displayRandomMovies();
  hideFilterOptions();
});

// Genres
async function getGenresFromAPI() {
  const apiUrl = `http://www.omdbapi.com/?apikey=${apiKeyOMDb}&s=`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data && data.Search && Array.isArray(data.Search)) {
    const genres = new Set();

    data.Search.forEach(movie => {
      if (movie.Genre) {
        const genreList = movie.Genre.split(', ');
        genreList.forEach(genre => genres.add(genre));
      }
    });

    return Array.from(genres);
  }

  return [];
}

async function fillGenreSelect() {
  const genres = await getGenresFromAPI();

  filterGenreSelect.innerHTML = '';

  const defaultOption = '<option value="">Genre</option>';
  filterGenreSelect.innerHTML = defaultOption;

  genres.forEach(genre => {
    const option = `<option value="${genre}">${genre}</option>`;
    filterGenreSelect.innerHTML += option;
  });
}

fillGenreSelect();

// Favorites
function addToFavorites(movieDetails, rating) {
    const favorites = getFavoritesFromLocalStorage();
    favorites.push({ ...movieDetails, rating });
    saveFavoritesToLocalStorage(favorites);
    updateFavoritesList();
  }

function getFavoritesFromLocalStorage() {
  const favoritesJSON = localStorage.getItem('favorites');
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

function saveFavoritesToLocalStorage(favorites) {
  const favoritesJSON = JSON.stringify(favorites);
  localStorage.setItem('favorites', favoritesJSON);
}

function updateFavoritesList() {
    const favoritesContainer = document.getElementById('favorites-list');
    favoritesContainer.innerHTML = '';
  
    const favorites = getFavoritesFromLocalStorage();
  
    favorites.forEach((movieDetails) => {
      const favoriteItem = document.createElement('div');
      favoriteItem.classList.add('favorite-item');
      favoriteItem.innerHTML = `
        <h3>${movieDetails.Title}</h3>
        <p> Film Waardering: ${movieDetails.rating || 'Niet beoordeeld'}</p>
        <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
        <button class="remove-favorite-button" data-imdbId="${movieDetails.imdbID}">Supprimer</button>
      `;
  
      favoritesContainer.appendChild(favoriteItem);
    });
  }
  
function removeFavorite(imdbId) {
    const favorites = getFavoritesFromLocalStorage();
    const updatedFavorites = favorites.filter((movie) => movie.imdbID !== imdbId);
    saveFavoritesToLocalStorage(updatedFavorites);
    updateFavoritesList();
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-favorite-button')) {
    const imdbId = event.target.getAttribute('data-imdbId'); 
    removeFavorite(imdbId);
  }
});

document.addEventListener('DOMContentLoaded', () => {
    displayRandomMovies();
    fillGenreSelect();
    updateFavoritesList();
  
    document.addEventListener('click', async(e) => {
      const target = e.target;
  
      if (target.classList.contains('like-button')) {
        const movieCard = target.parentElement;
        const movieId = movieCard.dataset.imdbId;
  
        if (movieId) {
          const movieDetails = await getMovieDetails(movieId);
  
          if (movieDetails) {
            const ratingInput = document.createElement('input');
            ratingInput.type = 'number';
            ratingInput.min = '1';
            ratingInput.max = '20';
            ratingInput.placeholder = 'Rate (1-20)';
            ratingInput.classList.add('rating-input');
  
            const addButton = document.createElement('button');
            addButton.textContent = 'Add';
            addButton.classList.add('rating-button', 'add-button'); 
  
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.classList.add('rating-button', 'cancel-button'); 
  
            const ratingContainer = document.createElement('div');
            ratingContainer.classList.add('rating-container'); 
            ratingContainer.append(ratingInput, addButton, cancelButton); 
  
            movieCard.appendChild(ratingContainer);
  
            addButton.addEventListener('click', async() => {
              const rating = parseInt(ratingInput.value, 10);
  
              if (rating >= 1 && rating <= 20) {
                await addToFavorites(movieDetails, rating);
                updateFavoritesList();
                ratingContainer.remove();
              }
            });
  
            cancelButton.addEventListener('click', () => {
              ratingContainer.remove();
            });
          }
        }
      }
    });
  });