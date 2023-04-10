const form = document.querySelector('form');
const buttonsDiv = document.querySelector('#buttons');
const key = 'Wzy8gud0klcnIVIqLTsiOZDsnaAlyJEsZHQ0Z8Mo';
const btnZoeken = document.querySelector('form button');
const favBtn = document.querySelector('#favBtn');
const audioBtns = document.querySelectorAll('.audioBtn');

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
        btn.addEventListener('click', () => {
            const audio = btn.nextElementSibling;
            audio.play();
        });
    });
}

const favoritesDiv = document.querySelector('#favDiv');

function addToFavorites(button) {
    const soundCard = button.parentNode;
    const soundCardClone = soundCard.cloneNode(true);
    const deleteButton = soundCardClone.querySelector('.delete-btn');
    deleteButton.removeAttribute('disabled');
    favoritesDiv.appendChild(soundCardClone);
}

function deleteFromFavorites(button) {
    const soundCard = button.parentNode;
    soundCard.remove();
}

function sound() {
    const audio = this.closest('.audio').querySelector('audio');
    if (!audio.paused) {
        audio.pause();
        this.classList.remove('active');
    } else {
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
audioBtns.forEach(btn => {
    btn = setRandomColor(btn);
    btn.addEventListener('click', sound);
});

