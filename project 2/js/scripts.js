/*  
@author Ahidar Aiman

bronnen: 
https://www.w3schools.com
https://chat.openai.com
Youtube videos
Cursus Toledo
*/

// Api key
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
// filter binnen de API wanneer je iets opzoek
async function getMovies(searchQuery) {
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

// gaat random films weergeven want de API heeft geen random dus we moeten die zelf maken (behulp chatgpt)
async function getRandomMovies() {
    const randomGenres = [
        'the', 'comedy', 'by', 'at', 'which', 'on', 'of',
        'go', 'horror', 'adventure', 'animation', 'a', 'and',
        'fantasy', 'mystery', '.', 'history', ':', 'to', 'the',
        'musical', 'sport', 'family', 'action', 'of', 'in', 'to', 'and'
    ];

    const randomMovies = [];
    randomGenres.sort(() => Math.random() - 0.5);
    
    for (const genre of randomGenres) {
      const moviesInGenre = await getMovies(genre);

      if (moviesInGenre.length > 0) {
        const randomIndex = Math.floor(Math.random() * moviesInGenre.length);
        randomMovies.push(moviesInGenre[randomIndex]);
      }
    }
    
    return randomMovies.slice(0, 12);
}

// toon de random films 
async function showRandomMovies() {
    const randomMovies = await getRandomMovies();
    displayMovies(randomMovies);
}

// gaat detalis van films uithalen
async function getMovieDetails(movieId) {
    const apiUrl = `http://www.omdbapi.com/?i=${movieId}&apikey=${apiKeyOMDb}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// maken van de films
async function displayMovies(movies) {
    movieList.innerHTML = '';

    if (movies.length === 0) {
        movieList.innerHTML = '<div class="error-message">Oups niets gevonden schrijf iets anders</div>';
        return;
    }

    for (const movie of movies) {
        const movieDetails = await getMovieDetails(movie.imdbID);

        if (movieDetails) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.setAttribute('data-imdbid', movie.imdbID);

            const posterContent = movieDetails.Poster !== 'N/A'
                ? `<img src="${movieDetails.Poster}" alt="${movieDetails.Title} Poster">`
                : '<div class="error-message">geen poster beschikbaar</div>';

            movieCard.innerHTML = `
                <h2>${movieDetails.Title}</h2>
                ${posterContent}
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

// Gaat films zoeken op basis van de filters
async function searchMovies(event) {
    event.preventDefault();
    const searchQuery = searchInput.value;
    const plotFilterValue = plotFilter.value;
    const awardsFilterValue = awardsFilter.checked;
    const typeFilterValue = typeFilter.value;
    const yearFilterValue = yearFilter.value;
    const modeFilterValue = modeFilter.value;
    const countryFilterValue = countryFilter.value;

    const movies = await getMovies(searchQuery, plotFilterValue, awardsFilterValue, typeFilterValue, yearFilterValue, modeFilterValue, countryFilterValue); // Modifié ici
    displayMovies(movies);
}

// Toon de filters wanneer je een film opzoek
function showFilterOptions() {
    const filters = document.getElementById('filter-options');
    filters.style.display = 'block';
}

// verberg de filters wanneer je random films kiest
function hideFilterOptions() {
    const filters = document.getElementById('filter-options');
    filters.style.display = 'none';
}

// de submit van de Form
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchMovies(event);
    showFilterOptions();
});

// een click event om de random films te tonen
randomButton.addEventListener('click', function(event) {
    event.preventDefault();
    showRandomMovies();
    hideFilterOptions();
});

// Genres Filter
// genres werkt niet binnen deze API maar het werkt met een andere API
// async function listbox() {
//     let url = `.../categories`;

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

// Favorites
// functie om het toevoegen van films in de favorites list
function addToFavorites(movieDetails, rating) {
    const favorites = getFavoritesFromLocalStorage();
    favorites.push({ ...movieDetails, rating });
    saveFavoritesToLocalStorage(favorites);
    updateFavoritesList();
}

// gaat een waardering vragen om uw mening te geven 
async function ratingForLike(movieId) {
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

// click event om films binnen de favorite lijst zetten
movieList.addEventListener('click', async(e) => {
    const target = e.target;

    if (target.classList.contains('like-button')) {
        const movieCard = target.closest('.movie-card');
        const movieId = movieCard.getAttribute('data-imdbid');

        console.log('movieId:', movieId);

        if (movieId) {
            await ratingForLike(movieId);
        }
    }
});

// het aanmaken van elementen binnen de favorite lijst
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
// gaat films uit de lijst verwijderen
function removeFavorite(imdbId) {
    const favorites = getFavoritesFromLocalStorage();
    const updatedFavorites = favorites.filter((movie) => movie.imdbID !== imdbId);
    saveFavoritesToLocalStorage(updatedFavorites);
    updateFavoritesList();
}

// De click event om films te verwijderen
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-favorite-button')) {
        const imdbId = event.target.getAttribute('data-imdbId');
        removeFavorite(imdbId);
    }
});


// kijk lijst
// functie om films toe te voegen binnen de watch-later list
async function addToWatchLater(movieDetails, rating) {
    const watchLater = getWatchLaterFromLocalStorage();
    watchLater.push({ ...movieDetails, rating });
    
    await saveWatchLaterToLocalStorage(watchLater);
    await updateWatchLaterList();
}

// het maken van films binnen de watch-later
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

// de click event om de films in de watch-later te steken 
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

// remove kijk lijst
// click event om films uit de watch-later te verwijderen
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-watch-later-button')) {
        const index = event.target.getAttribute('data-index');
        removeFromWatchLater(index);
    }
});

// functie om de films uit de watch-later te verwijderen
function removeFromWatchLater(index) {
    const watchLater = getWatchLaterFromLocalStorage();
    watchLater.splice(index, 1);
    saveWatchLaterToLocalStorage(watchLater);
    updateWatchLaterList();
}


// LocalStorage
// gaat films uithalen van de lijst
function getFavoritesFromLocalStorage() {
    const favoritesJSON = localStorage.getItem('favorites');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

// gaat films saven binnen de LocalStorage 
function saveFavoritesToLocalStorage(favorites) {
    const favoritesJSON = JSON.stringify(favorites);
    localStorage.setItem('favorites', favoritesJSON);
}

// gaat films uithalen van de lijst
function getWatchLaterFromLocalStorage() {
    const watchLaterJSON = localStorage.getItem('watchLater');
    return watchLaterJSON ? JSON.parse(watchLaterJSON) : [];
}

// gaat films saven binnen de LocalStorage 
function saveWatchLaterToLocalStorage(watchLater) {
    const watchLaterJSON = JSON.stringify(watchLater);
    localStorage.setItem('watchLater', watchLaterJSON);
}


// drag and drop (met behulp van chatgpt en youtube videos)
watchLaterList.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', Array.from(watchLaterList.children).indexOf(event.target).toString());
    setTimeout(() => event.target.classList.add('dragging'), 0); 
});

watchLaterList.addEventListener('dragover', (event) => {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const element = event.target.closest('.watch-later-item');

    if (element && element !== draggingElement) {
        const bounding = element.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;

        if (event.clientY - offset > 0) {
            element.style.borderBottom = '5px solid purple';
            element.style.borderTop = '';
        } else {
            element.style.borderTop = '5px solid purple';
            element.style.borderBottom = '';
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
    if (dropzone) {
        const targetIndex = Array.from(watchLaterList.children).indexOf(dropzone);
        if (droppedIndex !== targetIndex) {
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


// speech API (met behulp van youtube, w3schools en chatgpt)
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;

    document.getElementById('speech-btn').addEventListener('click', function() {
        recognition.start();
    });

    recognition.onresult = function (event) {
        let interim_transcript = '';
        let final_transcript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        if (final_transcript) {
            document.getElementById('input').value = final_transcript;
        } else if (interim_transcript) {
            document.getElementById('input').value = interim_transcript;
        }
    };

    recognition.onerror = function (event) {
        console.error('Erreur de reconnaissance vocale:', event);
    };
} else {
    document.getElementById('speech-btn').style.display = 'none';
}

// pagina laden
document.addEventListener('DOMContentLoaded', () => {
    showRandomMovies();
    updateFavoritesList();
    updateWatchLaterList();
});