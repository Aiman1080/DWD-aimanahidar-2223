const img = document.querySelector('img');
const text = document.querySelector('blockquote');
const select = document.querySelector('select');

async function someFetchFunction() {
    // build request
    let url = 'https://api.chucknorris.io/jokes/random'; // base url
    const params = new URLSearchParams(); // extra parameters
    params.append('parameter1', 'value1');
    params.append('parameter2', 'value2');
    url += '?' + params.toString();

    // fetch
    const resp = await fetch(url);
    if (!resp.ok) {
        console.log('opvragen chucknorris mislukt');
        return;
    }

    // get json data
    const data = await resp.json();

    // process data
    console.log('ontvangen data: ', data);

    img.src = data.icon_url;
    text.textContent = data.value;
}
someFetchFunction();

select.addEventListener('change', async function() {
    const url = 'https://api.chucknorris.io/jokes/random?category=' + this.value;

    // fetch
    const resp = await fetch(url);
    if (!resp.ok) {
        console.log('opvragen random mislukt');
        return;
    }

    // data
    const data = await resp.json();
    console.log('ontvangen data: ', data);

    text.textContent = data.value;
});

async function listbox() {
    let url = 'https://api.chucknorris.io/jokes/categories';

    const response = await fetch(url);
    if (!response.ok) {
        console.log('opvragen mislukt');
        return;
    }

    const data = await response.json();
    for (const category of data) {
        select.innerHTML += `<option>${category}</option>`;
    }
    console.log('ontvangen data: ', data);
}
listbox();