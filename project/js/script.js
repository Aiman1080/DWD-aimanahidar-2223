const form = document.querySelector('form');
const buttonsDiv = document.querySelector('#buttons');
const key = 'Wzy8gud0klcnIVIqLTsiOZDsnaAlyJEsZHQ0Z8Mo';

async function someFetchFunction(query) {
  let url = `https://freesound.org/apiv2/search/text/?query=${query}&key=${key}`;

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

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.querySelector('#zoek').value;
  await someFetchFunction(query);
});