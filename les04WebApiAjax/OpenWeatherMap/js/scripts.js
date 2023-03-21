const text = document.querySelector('#text');

async function someFetchFunction() {
    // build request
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=Brussels&appid=a9d44e8de9257721c6b4d726ba82463c&lang=nl&units=metric'; // base url
    // const params = new URLSearchParams(); // extra parameters
    // params.append('parameter1', 'value1');
    // params.append('parameter2', 'value2');
    // url += '?' + params.toString();
    // fetch
    const resp = await fetch(url);
    if (!resp.ok) {
        console.log('opvragen weather mislukt');
        return;
    }
    // get json data
    const data = await resp.json();
    // process data
    console.log('ontvangen data: ', data);
    
    text.innerHTML = `Het is in ${data.name} ${data.main.temp}°C en ${data.weather[0].description}`;
}
someFetchFunction();