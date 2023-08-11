const apiKeyOMDb = 'fd81530e';

const searchForm = document.getElementById('form');
const searchInput = document.getElementById('input');
const movieList = document.getElementById('list');
const randomButton = document.getElementById('random-button');

const plotFilter = document.getElementById('filter-plot');
const awardsFilter = document.getElementById('filter-awards');
const typeFilter = document.getElementById('filter-type');
const yearFilter = document.getElementById('filter-year');
const modeFilter = document.getElementById('filter-mode');
const countryFilter = document.getElementById('filter-country');

const watchLaterList = document.getElementById('watch-later-list');
watchLaterList.classList.add('watch-later-list');

// filters en search
async function getMoviesBySearch(searchQuery) {
    let apiUrl = `http://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKeyOMDb}`;
  
    const plotFilterValue = plotFilter.value; 
    if (plotFilterValue) {
      apiUrl += `&plot=${encodeURIComponent(plotFilterValue)}`;
    }
  
    const awardsFilterValue = awardsFilter.checked;
    if (awardsFilterValue) {
      apiUrl += '&awards=true';
    }
  
    const yearFilterValue = yearFilter.value;
    if (yearFilterValue) {
      apiUrl += `&y=${encodeURIComponent(yearFilterValue)}`;
    }
  
    const countryFilterValue = countryFilter.value;
    if (countryFilterValue) {
      apiUrl += `&country=${encodeURIComponent(countryFilterValue)}`;
    }
  
    const typeFilterValue = typeFilter.value;
    if (typeFilterValue) {
      apiUrl += `&type=${encodeURIComponent(typeFilterValue)}`;
    }
  
    const modeFilterValue = modeFilter.value;
    if (modeFilterValue) {
      apiUrl += `&mode=${encodeURIComponent(modeFilterValue)}`;
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
      movieCard.setAttribute('data-imdbid', movie.imdbID);
      movieCard.innerHTML = `
        <h2>${movieDetails.Title}</h2>
        <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
        <p>Genre: ${movieDetails.Genre}</p>
        <p>Director: ${movieDetails.Director}</p>
        <p>Release Date: ${movieDetails.Released}</p>
        <button class="like-button">Like</button>
        <button class="watch-later-button">Kijk lijst</button>
      `;
      movieList.appendChild(movieCard);
    }
  }
}

async function searchMovies(event) {
    event.preventDefault();
    const searchQuery = searchInput.value;
    const plotFilterValue = plotFilter.value; 
    const awardsFilterValue = awardsFilter.checked;
    const typeFilterValue = typeFilter.value;
    const yearFilterValue = yearFilter.value;
    const modeFilterValue = modeFilter.value;
    const countryFilterValue = countryFilter.value;
  
    const movies = await getMoviesBySearch(searchQuery, plotFilterValue, awardsFilterValue, typeFilterValue, yearFilterValue, modeFilterValue, countryFilterValue); // Modifié ici
    displayMovies(movies);
}

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

// genres
// genres werkt niet binnen deze API
// async function listbox() {
//     let url = `http://www.omdbapi.com/?apikey=${apiKeyOMDb}/categories`;

//     const response = await fetch(url);
//     if (!response.ok) {
//         console.log('opvragen mislukt');
//         return;
//     }

//     const data = await response.json();
//     for (const category of data) {
//         genreFilter.innerHTML += `<option>${category}</option>`;
//     }
//     console.log('ontvangen data: ', data);
// }
// listbox();

// fillGenreSelect();

// Favorites
function addToFavorites(movieDetails, rating) {
    const favorites = getFavoritesFromLocalStorage();
    favorites.push({ ...movieDetails, rating });
    saveFavoritesToLocalStorage(favorites);
    updateFavoritesList();
  }

  async function handleLikeButtonClick(movieId) {
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
  
      const movieCard = document.querySelector(`.movie-card[data-imdbid="${movieId}"]`);
      const watchLaterButton = movieCard.querySelector('.watch-later-button');
  
      if (watchLaterButton) {
        watchLaterButton.parentElement.appendChild(ratingContainer);
  
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
        <button class="remove-favorite-button" data-imdbId="${movieDetails.imdbID}">Verwijderen</button>
      `;
  
      favoritesContainer.appendChild(favoriteItem);
    });
  }
  
// remove favorites
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

  // kijk lijst
  document.addEventListener('click', async(e) => {
    const target = e.target;
  
    if (target.classList.contains('watch-later-button')) {
      const movie = target.closest('.movie-card');
      const movieId = movie.dataset.imdbid;
  
      if (movieId) {
        const movieDetails = await getMovieDetails(movieId);
  
        if (movieDetails) {
          addToWatchLater(movieDetails);
          updateWatchLaterList();
        }
      }
    }
  });
  
  function addToWatchLater(movieDetails, rating) {
    const watchLater = getWatchLaterFromLocalStorage();
    watchLater.push({ ...movieDetails, rating });
    saveWatchLaterToLocalStorage(watchLater);
    updateWatchLaterList();
  }
  
  function updateWatchLaterList() {
    watchLaterList.innerHTML = '';
    const watchLater = getWatchLaterFromLocalStorage();
    const filteredWatchLater = watchLater.filter(item => item !== null);

    filteredWatchLater.forEach((movieDetails, index) => {
        const watchLaterItem = document.createElement('div');
        watchLaterItem.classList.add('watch-later-item');
        watchLaterItem.draggable = true;

        watchLaterItem.innerHTML = `
        <div class="watch-later-content">
            <img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">
            <h3>${index + 1}. ${movieDetails.Title}</h3>
            <button class="remove-watch-later-button" data-index="${index}">Verwijderen</button>
        </div>`;

        watchLaterList.appendChild(watchLaterItem);
        watchLaterItem.setAttribute('draggable', true);
    });
}
 
function getWatchLaterFromLocalStorage() {
  const watchLaterJSON = localStorage.getItem('watchLater');
  return watchLaterJSON ? JSON.parse(watchLaterJSON) : [];
}

function saveWatchLaterToLocalStorage(watchLater) {
  const watchLaterJSON = JSON.stringify(watchLater);
  localStorage.setItem('watchLater', watchLaterJSON);
}

// remove kijk lijst
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-watch-later-button')) {
      const index = event.target.getAttribute('data-index'); 
      removeFromWatchLater(index);
    }
  });
  function removeFromWatchLater(index) {
    const watchLater = getWatchLaterFromLocalStorage();
    watchLater.splice(index, 1);
    saveWatchLaterToLocalStorage(watchLater);
    updateWatchLaterList();
  }
  

// drag and drop
watchLaterList.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', Array.from(watchLaterList.children).indexOf(event.target).toString());
    setTimeout(() => event.target.classList.add('dragging'), 0); // Utilisez setTimeout pour éviter des problèmes d'affichage
});

watchLaterList.addEventListener('dragover', (event) => {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const currentElement = event.target.closest('.watch-later-item');

    if (currentElement && currentElement !== draggingElement) {
        const bounding = currentElement.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;
        
        if (event.clientY - offset > 0) {
            currentElement.style.borderBottom = '3px solid blue';
            currentElement.style.borderTop = '';
        } else {
            currentElement.style.borderTop = '3px solid blue';
            currentElement.style.borderBottom = '';
        }
    }
});

watchLaterList.addEventListener('dragleave', (event) => {
    event.target.style.borderTop = '';
    event.target.style.borderBottom = '';
});

watchLaterList.addEventListener('drop', (event) => {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    draggingElement.classList.remove('dragging');
    const droppedIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const dropzone = event.target.closest('.watch-later-item');
    if(dropzone) {
        const targetIndex = Array.from(watchLaterList.children).indexOf(dropzone);
        if(droppedIndex !== targetIndex) {
            const watchLaterItems = getWatchLaterFromLocalStorage();
            const draggedItem = watchLaterItems.splice(droppedIndex, 1)[0];
            watchLaterItems.splice(targetIndex, 0, draggedItem);
            saveWatchLaterToLocalStorage(watchLaterItems);
            updateWatchLaterList();
        }
    }
    watchLaterList.querySelectorAll('.watch-later-item').forEach(item => {
        item.style.borderTop = '';
        item.style.borderBottom = '';
    });
});

  // pagina laden
  document.addEventListener('DOMContentLoaded', () => {
    displayRandomMovies();
    updateFavoritesList();
    updateWatchLaterList();
  
    movieList.addEventListener('click', async(e) => {
      const target = e.target;
  
      if (target.classList.contains('like-button')) {
        const movieCard = target.closest('.movie-card');
        const movieId = movieCard.getAttribute('data-imdbid');
  
        console.log('movieId:', movieId);
  
        if (movieId) {
          await handleLikeButtonClick(movieId);
        }
      }
    });
});
  