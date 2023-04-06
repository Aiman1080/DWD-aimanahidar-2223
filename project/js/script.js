const form = document.querySelector('form');
const buttonsDiv = document.querySelector('#buttons');

async function someFetchFunction(e) {
    let url = `https://freesound.org/apiv2/search/text/?query=${e}`;

    // fetch
    const resp = await fetch(url);
    if (!resp.ok) {
        console.log('Erreur de fetch');
        return;
    }

    // get json data
    const data = await resp.json();

    console.log(data);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const zoek = document.querySelector('#zoek').value;
  someFetchFunction(zoek);
});