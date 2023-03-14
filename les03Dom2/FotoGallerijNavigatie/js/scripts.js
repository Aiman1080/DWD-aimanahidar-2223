const figBig = document.querySelector('#figBig');
const thumbLinks = document.querySelectorAll('.thumbs a');

const buttons = document.querySelectorAll('.navbuttons button');
let index = 0;

function showImage(lnk) {
   figBig.querySelector('img').src = lnk.href;
   figBig.querySelector('figcaption').innerHTML = lnk.querySelector('img').alt;
   document.querySelector('.thumbs .active').classList.remove('active');
   lnk.classList.add('active');
}

thumbLinks.forEach(lnk => {
   lnk.addEventListener('click', function(e) {
      e.preventDefault();
      showImage(lnk);
   });
});

buttons.forEach(btn => {
   btn.addEventListener('click', function() {
     if (btn.id == 'btnPrev' && index > 0) {
       index--;
     } else if (btn.id == 'btnNext' && index < 4) {
       index++;
     }
     showImage(thumbLinks[index]);
   });
 });
 