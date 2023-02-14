const iteraties = 10000;
const getal = 9000;
const gokken = Math.floor(Math.random() * getal) + 1000;
const antwoorden = [];
let juist0 = 0;
let juist1 = 0;
let juist2 = 0;
let juist3 = 0;
let juist4 = 0;

console.log('%c // trekking', 'color: purple; font-size: 18px;');
console.log(`%c getrokken getal: ${gokken}`, 'color: yellow;');
console.log('\n');

console.log('%c // gokken', 'color: purple; font-size: 18px;');
console.log(`aantal iteraties: ${iteraties}`);
console.log('\n');

console.log('%c // resultaten', 'color: purple; font-size: 18px;');
for (let i = 0; i < iteraties; i++) {
    const gok = genererenVanGetal ();
    const teller = aantalJuisteCijfers(gokken, gok);

    antwoorden.push(teller);
}
const totaal = gemiddelde(antwoorden);

console.log(`0 juist: ${juist0}`);
console.log(`1 juist: ${juist1}`);
console.log(`2 juist: ${juist2}`);
console.log(`3 juist: ${juist3}`);
console.log(`4 juist: ${juist4}`);
console.log(`%c gemiddelde winst: € ${totaal}`, 'background: gray; color: green; padding: 15px;');

function genererenVanGetal() {
    return Math.floor(Math.random() * getal) + 1000;
}

function aantalJuisteCijfers(gokken, getal) {
    let resultaat;
    if (getal === gokken) {
        resultaat = 500;
        juist4 += 1;
    }
    else if ((gokken %= 1000) === (getal %= 1000)) {
        resultaat = 100;
        juist3 += 1;
    }
    else if ((gokken %= 100) === (getal %= 100)) {
        resultaat = 10;
        juist2 += 1;
    }
    else if ((gokken %= 10) === (getal %= 10)) {
        resultaat = 2.5;
        juist1 += 1;
    } else {
        resultaat = 0;
        juist0 += 1;
    }
    return resultaat;
}

function gemiddelde(getal) {
    let teller = 0;
    for (let i = 0; i < getal.length; i++) {
      teller += getal[i];
    }
  
    const gemiddelde = teller / getal.length;
    return gemiddelde;
}