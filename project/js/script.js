const form = document.querySelector('form');
const buttonsDiv = document.querySelector('#buttons');
const key = 'Wzy8gud0klcnIVIqLTsiOZDsnaAlyJEsZHQ0Z8Mo';
const btnZoeken = document.querySelector('form button');
const favBtn = document.querySelector('#favBtn');
const favoritesDiv = document.querySelector('#favDiv');
const favContainer = document.querySelector('.favorites');

const url = `https://freesound.org/apiv2/search/text/?token=${key}`;

btnZoeken.addEventListener('click', async function (e) {
    e.preventDefault();
    const txt = document.querySelector('form input').value;
    const data = await fetch(`${url}&query=${txt}&fields=id,name,previews,duration,images`);
    const res = await data.json();
    const results = result(res);
    create(results);
    attachEventListeners();
});

function result(results) {
    return results.results.map(resultaat => {
        const id = resultaat.id;
        const title = resultaat.name;
        const time = resultaat.duration;
        const audio = resultaat.previews['preview-lq-mp3'];
        const img = resultaat.images.waveform_m;
        return { id, title, time, audio, img };
    });
}

function createSound(r) {
    return `
  <div class="soundwrapper" id="${r.id}">
    <div class="sound-card">
      <h2>${r.title}</h2>
      <img src="${r.img}" alt="${r.title}">
      <div class="sound__background" style="background-image: url(${r.images});"></div>
          <button class="audioBtn"></button>
          <audio src="${r.audio}"></audio>
      <p>${r.time}S</p>
      <button class="favosection">Add to favorites</button>
      <button class="faster">X2</button>
    </div>
  `;
}

function create(results) {
    const resHTML = results.map(resultaat => createSound(resultaat)).join('');
    buttonsDiv.innerHTML = resHTML;

    const audioBtns = document.querySelectorAll('.audioBtn');
    audioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const audio = this.nextElementSibling;
            if (audio.paused) {
                audio.play();
                this.classList.add('playing');
            }
            else {
                audio.pause();
                audio.currentTime = 0;
                this.classList.remove('playing');
            }
        });
    });
}

const audio = document.querySelector('audio');
const fasterButton = document.querySelector('.faster');

fasterButton.addEventListener('click', function () {
    audio.playbackRate = 2;
});

const refreshBtn = document.querySelector('.refresh');

refreshBtn.addEventListener('click', function () {
    location.reload();
});

const audios = document.querySelectorAll('.audio');
const buttons = document.querySelectorAll('.audioBtn');
buttons.forEach((btn, index) => {
    btn.addEventListener('click', function () {
        audios.forEach((audio, audioIndex) => {
            if (audioIndex !== index) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        audios[index].play();
    });
});

function sound() {
    const soundWrapper = this.closest('.soundwrapper');
    const audio = soundWrapper.querySelector('audio');
    const activeBtn = document.querySelector('.audioBtn.active');

    if (activeBtn && activeBtn !== this) {
        const activeAudio = activeBtn.nextElementSibling;
        activeAudio.pause();
        activeBtn.classList.remove('active');
    }

    if (!audio.paused) {
        audio.pause();
        this.classList.remove('active');
    } else {
        const allAudios = document.querySelectorAll('.audioBtn');
        allAudios.forEach(btn => {
            const otherAudio = btn.nextElementSibling;
            if (otherAudio !== audio) {
                otherAudio.pause();
                btn.classList.remove('active');
            }
        });
        audio.play();
        this.classList.add('active');

        // Create a copy of the sound card and append it to the favorites section
        const favoritesWrapper = soundWrapper.cloneNode(true);
        const favosection = favoritesWrapper.querySelector('.favosection');
        favosection.remove(); // remove the "Add to favorites" button from the copy
        favContainer.appendChild(favoritesWrapper);
    }
}


function setRandomColor(element) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    element.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    return element;
}

const audioBtns = document.querySelectorAll('.audioBtn');
audioBtns.forEach(btn => {
    setRandomColor(btn);
    btn.addEventListener('click', sound);
});

function attachEventListeners() {
    const favoriteBtns = document.querySelectorAll('.btnfav');
    favoriteBtns.forEach((btn) => {
        btn.addEventListener('click', toggleFavorite);
    });

    const playSoundButtons = document.querySelectorAll('.audioBtn');
    playSoundButtons.forEach((button) => {
        button.addEventListener('click', togglePlaySound);
    });
}

// Récupérer les éléments HTML
const favosectionButton = document.getElementById('favosection');
const favorietesoundsDiv = document.getElementById('favorietesounds');
const soundButton = document.getElementById('sound__button');

// Ajouter un événement de clic sur le bouton "favosection"
favosectionButton.addEventListener('click', () => {
    // Déplacer le bouton "sound__button" dans le div "favorietesounds"
    favorietesoundsDiv.appendChild(soundButton);
});

const sounds = document.querySelector('.sounds');


function togglePlaySound() {
    const audioElement = this.closest('.sound').querySelector('.audioBtn');
    if (audioElement.paused) {
        audioElement.play();
        this.classList.add('audioBtn--active');
    } else {
        audioElement.pause();
        audioElement.currentTime = 0;
        this.classList.remove('audioBtn--active');
    }
}

const favosectionBtn = document.getElementById('favosection');
const soundBtn = document.getElementById('sound__button');
const favoritesoundsDiv = document.getElementById('favoritesounds');

favosectionBtn.addEventListener('click', () => {
    favoritesoundsDiv.appendChild(soundBtn);
});
const deleteBtn = document.querySelector('#deletebtn');

function removeAllButtons() {
    const soundWrappers = sounds.querySelectorAll('.soundwrapper');
    soundWrappers.forEach(soundWrapper => {
        const soundButton = soundWrapper.querySelector('.audioBtn');
        sounds.appendChild(soundWrapper);
        soundButton.classList.remove('audioBtn--active');
    });
    sounds.innerHTML = '';
}
deleteBtn.addEventListener('click', removeAllButtons);

sounds.addEventListener('DOMNodeInserted', attachEventListeners);
sounds.addEventListener('DOMNodeRemoved', attachEventListeners);

loadFavoriteSounds();
attachEventListeners();