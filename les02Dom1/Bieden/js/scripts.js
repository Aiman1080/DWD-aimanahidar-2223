const msg = document.querySelector('#message');
const btn = document.querySelector('#button');
const inpNaam = document.querySelector('#naam');
const inpBod = document.querySelector('#prijs');

let hoogsteBod = 0;
let helpNaam;

btn.addEventListener('click', function(e) {
    e.preventDefault();

    if (inpNaam.value !== '' && inpBod.value !== '') {
        const helpBod = parseInt(inpBod.value);
        if (helpBod > hoogsteBod) {
            hoogsteBod = helpBod;
            helpNaam = inpNaam.value;
            msg.innerHTML = 'gefeliciteerd! je hebt momenteel het \n hoogste bod';
        } else {
            msg.innerHTML = `jammer! ${helpNaam} heeft een hoger bod`;
        }
    } else {
        msg.innerHTML = 'er is nog geen bod uitgebracht';
    }
    inpNaam.value = '';
    inpBod.value = '';
});