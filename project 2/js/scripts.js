const apiKeyOMDb = 'fd81530e';
const searchForm = document.getElementById('form');
const searchInput = document.getElementById('input');
const movieList = document.getElementById('list');

async function getMoviesBySearch(searchQuery) {
  const apiUrl = `http://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKeyOMDb}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.Search || [];
}

async function getRandomMovies() {
    const randomKeywords = ['movie', 'film'];
    const randomSearch = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    const movies = await getMoviesBySearch(randomSearch);
    return movies;
  }

async function displayRandomMovies() {
    const randomMovies = await getRandomMovies();
    displayMovies(randomMovies);
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
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = `
        <h2>${movieDetails.Title}</h2>
        <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
        <p>Genre: ${movieDetails.Genre}</p>
        <p>Regisseur: ${movieDetails.Director}</p>
        <p>Datum van publicatie: ${movieDetails.Released}</p>
      `;
      movieList.appendChild(movieCard);
    }
  }
}

async function searchMovies(event) {
  event.preventDefault();
  const searchQuery = searchInput.value;
  const movies = await getMoviesBySearch(searchQuery);
  displayMovies(movies);
}

searchForm.addEventListener('submit', searchMovies);

