const lstPhoto = document.querySelectorAll('#grid figure');
const filter = document.querySelectorAll('.nav__filters a');
const numFound = document.querySelector('#numFound');

const view = document.querySelectorAll('.header__view a');
const grid = document.querySelector('#grid');

filter.forEach(e => {
    e.addEventListener('click', function() {
        document.querySelector('.nav__filters .active').classList.remove('active');
        e.classList.add('active');
        let teller = 0;
        const hulp = e.getAttribute('data-filter');
        lstPhoto.forEach(fig => {
            const list = fig.getAttribute('data-filters').split(' ');
            if (list.includes(hulp) || hulp.includes('alle')) {
                fig.classList.remove('hidden');
                teller++;
            } else {
                fig.classList.add('hidden');
            }
        });
        numFound.innerHTML = teller;
    });
});

view.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.active').classList.remove('active');
        if (link.id == 'lnkViewList') {
//            console.log('link.id:', link.id);
            grid.classList.remove('viewGrid');
            grid.classList.add('viewList');
        } else if (link.id == 'lnkViewGrid') {
            grid.classList.remove('viewList');
            grid.classList.add('viewGrid');
        }
        link.classList.add('active');
    });
}); 