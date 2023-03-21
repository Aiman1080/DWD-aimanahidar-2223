const lstImg = document.querySelectorAll('figure img');
let hulp;

const naam = document.querySelector('#ddNaam');
const calorieen = document.querySelector('#ddCalorieen');
const beschrijving = document.querySelector('#ddBeschrijving');

lstImg.forEach(img => {
    img.addEventListener('click', function() 
    {
        let currentId = document.querySelector('.active');
        if (currentId) {
            currentId.classList.remove('active');
        }
        img.classList.add('active');
        hulp = true;

        naam.innerHTML = img.alt;
        calorieen.innerHTML = img.getAttribute('data-calorieen');
        beschrijving.innerHTML = img.getAttribute('data-beschrijving');
    });
});