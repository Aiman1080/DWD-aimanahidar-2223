const form = document.querySelector('form');
const buttonsDiv = document.querySelector('#buttons');
const key = 'Wzy8gud0klcnIVIqLTsiOZDsnaAlyJEsZHQ0Z8Mo';
const btnZoeken = document.querySelector('form button');
const favBtn = document.querySelector('#favBtn');
const favoritesDiv = document.querySelector('#favDiv');
const favContainer = document.querySelector('#fav');

favContainer.classList.add('hidden');

const url = `https://freesound.org/apiv2/search/text/?token=${key}`;

btnZoeken.addEventListener('click', async function (e) {
    e.preventDefault();
    const txt = document.querySelector('form input').value;
    const data = await fetch(`${url}&query=${txt}&fields=id,name,previews,duration,images`);
    const res = await data.json();
    const results = result(res);
    create(results);
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
      <div class="sound-card">
        <h2>${r.title}</h2>
        <img src="${r.img}" alt="${r.title}">
        <div class="audio">
            <button class="audioBtn"></button>
            <audio src="${r.audio}"></audio>
        </div>
        <p>${r.time}</p>
        <button class="add-btn" onclick="addToFavorites(this)">Add</button>
        <button class="delete-btn" onclick="deleteFromFavorites(this)" disabled>Delete</button>
      </div>
    `;
}

function create(results) {
    const resHTML = results.map(resultaat =>
        createSound(resultaat)).join('');
    buttonsDiv.innerHTML = resHTML;

    const audioBtns = document.querySelectorAll('.audioBtn');
    audioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const audio = this.nextElementSibling;
            if (audio.paused) {
                audio.play();
                this.classList.add('playing');
            } else {
                audio.pause();
                audio.currentTime = 0;
                this.classList.remove('playing');
            }
        });
    });
}

const buttons = document.querySelectorAll('.audioBtn');
const audios = document.querySelectorAll('.audio');

buttons.forEach((btn, index) => {
  btn.addEventListener('click', function() {
    audios.forEach((audio, audioIndex) => {
      if (audioIndex !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    audios[index].play();
  });
});

function addToFavorites(button) {
    const soundCard = button.parentNode;
    const soundCardClone = soundCard.cloneNode(true);
    const deleteButton = soundCardClone.querySelector('.delete-btn');
    deleteButton.removeAttribute('disabled');
    favoritesDiv.appendChild(soundCardClone);
    favContainer.classList.remove('hidden');

    const favoriteSounds = JSON.parse(localStorage.getItem('favoriteSounds')) || [];
    const sound = { id: soundCardClone.id, html: soundCardClone.outerHTML };
    favoriteSounds.push(sound);
    localStorage.setItem('favoriteSounds', JSON.stringify(favoriteSounds));
}

function deleteFromFavorites(button) {
    const soundCard = button.parentNode;
    soundCard.remove();

    const favoritesDiv = document.querySelector('#favDiv');
    const favoritesList = favoritesDiv.querySelectorAll('.sound-card');
    if (favoritesList.length === 0) {
        const favoritesHeader = document.querySelector('#fav p');
        removeLocalStorage(favoritesHeader.dataset.id);
        const favoritesSection = document.querySelector('#fav');
        favoritesSection.style.display = 'none';
    }

    const favoriteSounds = JSON.parse(localStorage.getItem('favoriteSounds')) || [];
    const update = favoriteSounds.filter((sound) => sound.id !== soundCard.id);
    localStorage.setItem('favoriteSounds', JSON.stringify(update));
}

function sound() {
    const audio = this.closest('.audio').querySelector('audio');
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
    btn = setRandomColor(btn);
    btn.addEventListener('click', sound);
});

function removeLocalStorage(x) {
    const save = JSON.parse(localStorage.getItem('favorite')) || [];
    const update = save.filter((sound) => sound.id !== x);
    localStorage.setItem('favorite', JSON.stringify(update));
}

