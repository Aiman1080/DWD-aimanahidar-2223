const btn = document.querySelector('#frmTask');
const taak = document.querySelector('#txtTask');
const datum = document.querySelector('#datDeadline');
const lijst = document.querySelector('#tasks');

const dropBox = document.querySelector('#selPriority');

btn.addEventListener('submit', function(e) {
    e.preventDefault();

    let kleur;
    const prioriteit = dropBox[dropBox.selectedIndex].value;

    if (prioriteit == 'low') {
        kleur = 'green';
    } else if (prioriteit == 'normal') {
        kleur = 'orange';
    } else if (prioriteit == 'high') {
        kleur = 'red';
    }
    if (datum == '') {
        const hulpHtml = `<div class="task"><span class="${kleur} priority material-icons">assignment</span><p class="tasktext">${taak.value}</span></p><span class="complete material-icons">more_horiz</span></div>`;
        lijst.innerHTML += hulpHtml;
    }
    else if (datum != '') {
        const hulpHtml = `<div class="task"><span class="${kleur} priority material-icons">assignment</span><p class="tasktext">${taak.value}<span class="deadline">(deadline: ${datum.value})</span></p><span class="complete material-icons">more_horiz</span></div>`;
        lijst.innerHTML += hulpHtml;
    }

    taak.value = '';
    datum.value = '';
});
lijst.addEventListener('click', function(e) {
    if (e.target.innerHTML == 'more_horiz') {
        e.target.innerHTML = 'done';
        e.target.classList.add('done');
    }
});
