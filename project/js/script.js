const form = document.querySelector('form');
const buttonsDiv = document.querySelector('#buttons');
const key = 'Wzy8gud0klcnIVIqLTsiOZDsnaAlyJEsZHQ0Z8Mo';
const btnZoeken = document.querySelector('form button');

const url = `https://freesound.org/apiv2/search/text/?token=${key}`;

btnZoeken.addEventListener('click', async function(e) {
  e.preventDefault();
  const txt = document.querySelector('form input').value;
  const data = await fetch(`${url}&query=${txt}&fields=id,name,previews,duration,images`);
  const res = result(await data.json());
  create(res);
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
      <audio controls src="${r.audio}"></audio>
      <p>${r.time}</p>
    </div>
  `;
}

function create(res) {
  const resHTML = res.map(resultaat => 
    createSound(resultaat)).join('');
  buttonsDiv.innerHTML = resHTML;
}