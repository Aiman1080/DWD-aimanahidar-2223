const img = document.querySelector('#van');
const buttons = document.querySelectorAll('.filters button');
let filter = 'filter-normal';

const slider = document.querySelector('#slider1');
const slider1 = document.querySelector('#slider1-val');

buttons.forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelector('.active').classList.remove('active');
    img.classList.remove(filter);
    filter = btn.id;
    btn.classList.add('active');
    img.classList.add(filter);
  });
});

slider.addEventListener('input', function() {
  const opacityValue = Math.round(slider.value * 100);
  slider1.innerText = `${opacityValue} %`;
  img.style.opacity = slider.value;
});
