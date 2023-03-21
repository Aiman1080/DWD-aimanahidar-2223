const figBig = document.querySelector('#figBig');
const thumbLinks = document.querySelectorAll('.thumbs a');
const btnPrev = document.querySelector('#btnPrev');
const btnNext = document.querySelector('#btnNext');
let index = 0;

function showImage(lnk) {
   figBig.querySelector('img').src = lnk.href;
   figBig.querySelector('figcaption').innerHTML = lnk.querySelector('img').alt;
   document.querySelector('.thumbs .active').classList.remove('active');
   lnk.classList.add('active');
}

thumbLinks.forEach((lnk, teller) => {
   lnk.addEventListener('click', function(e) {
      e.preventDefault();
      index = teller;
      showImage(lnk);
   });
});

btnPrev.addEventListener('click', function(e) {
  e.preventDefault();
  if (index > 0) {
    index = index - 1;
  } else {
    index = thumbLinks.length - 1;
  }
  showImage(thumbLinks[index]);
});

btnNext.addEventListener('click', function(e) {
  e.preventDefault();
  if (index < thumbLinks.length - 1) {
    index = index + 1;
  } else {
    index = 0;
  }
  showImage(thumbLinks[index]);
});
