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

displayRandomMovies();

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
      const movieCard = `
        <div class="movie-card">
          <h2>${movieDetails.Title}</h2>
          <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
          <p>Genre: ${movieDetails.Genre}</p>
          <p>Director: ${movieDetails.Director}</p>
          <p>Release Date: ${movieDetails.Released}</p>
        </div>
      `;
      movieList.innerHTML += movieCard;
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