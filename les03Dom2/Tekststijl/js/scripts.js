const slider = document.querySelector('#slider1');
const px = document.querySelector('#px');
const tekst = document.querySelector('#tekst p');
const tekst1 = document.querySelector('#tekst');

const kleur = document.querySelector('#kleur1');

const vet = document.querySelector('#vet');
const schuin = document.querySelector('#schuin');
const hoofdletters = document.querySelector('#hoofdletters');

const stijl1 = document.querySelector('#stijl1');
const stijl2 = document.querySelector('#stijl2');
const stijl3 = document.querySelector('#stijl3');

slider.addEventListener('input', function() {    
    tekst.style.fontSize = slider.value + 'px';
    px.innerHTML = `${slider.value}px`;
});

kleur.addEventListener('input', function() {
    tekst.style.color = kleur.value;
});

vet.addEventListener('click', function() {
    if (vet.checked) {
        tekst.style.fontWeight = 'bold';
    } else {
        tekst.style.fontWeight = 'normal';
    }
});

schuin.addEventListener('click', function() {
    if (schuin.checked) {
        tekst.style.fontStyle = 'italic';
    } else {
        tekst.style.fontStyle = 'normal';
    }
});

hoofdletters.addEventListener('click', function() {
    if (hoofdletters.checked) {
        tekst.style.textTransform = 'uppercase';
    } else {
        tekst.style.textTransform = 'lowercase';
    }
});

stijl1.addEventListener('click', function() {
    if (!tekst.classList.contains('shadow')) {
        tekst.classList.add('shadow');
    } else {
        tekst.classList.remove('shadow');
    }
});

stijl2.addEventListener('click', function() {
    if (!tekst1.classList.contains('background')) {
        tekst1.classList.add('background');
    } else {
        tekst1.classList.remove('background');
    }
});

stijl3.addEventListener('click', function() {
    if (!tekst.classList.contains('transform')) {
        tekst.classList.add('transform');
    } else {
        tekst.classList.remove('transform');
    }
});