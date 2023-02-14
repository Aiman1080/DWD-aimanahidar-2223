const form = document.querySelector('#frmOrder');
const inpEmail = form.querySelector('#inpEmail');
const msgEmail = form.querySelector('#msgEmail');
const selMeasure = form.querySelector('#selMeasure');
const msgMeasure = form.querySelector('#msgMeasure');

const model = document.querySelectorAll('#model a');
const fig = document.querySelector('#figShoe');
const figImg = fig.querySelector('img');
const figCap = fig.querySelector('figcaption span');

const accessoires = document.querySelectorAll('#accessoires .accessoire');
const message = document.querySelector('#lblMessage');


// formchecking

form.setAttribute('novalidate', 'novalidate');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // let numErrors = 0;

    // clear
    msgEmail.innerHTML = '';
    msgMeasure.innerHTML = '';
    const namen = [];
    let som = 54.99;
    let schoenen = '';

    // email
    if (inpEmail.value == '') {
    //    numErrors++;
        msgEmail.innerHTML = 'email mag niet leeg zijn';
    }

    // selMeasure
    if (selMeasure.value == '') {
    //    numErrors++;
        msgMeasure.innerHTML = 'selecteer je maat';
    }

    // if (numErrors == 0) {
    //     form.submit();
    //  }

     // eindtekst
     
     if (inpEmail.value && selMeasure.value != '') {
        accessoires.forEach(element => {
            if (element.querySelector('input').checked) {
                namen.push(element.querySelector('input').name);
                som += Number(element.querySelector('input').value);
              }                 
        });
        if (namen.length > 0) {
            schoenen = namen.join(', ');
          }
        message.innerHTML = `Je keuze: ${figCap.innerHTML} maat ${selMeasure.value}, ${schoenen} (totaalprijs: €${som})`;
      }
});

// afbeelding en onderschrift

model.forEach(lnk => {
    lnk.addEventListener('click', function(e) {
        e.preventDefault();
        figImg.src = lnk.href;
        figCap.innerHTML = lnk.innerHTML;
        document.querySelector('#model .selected').classList.remove('selected');
        lnk.classList.add('selected');
     });
});

