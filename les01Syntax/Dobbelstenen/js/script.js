// declarations
const rnd = Math.ceil(Math.random() * 6);
const players = ['Magnus', 'Eline', 'Ding', 'Judith', 'Praggna'];
const scores = [players.length];
const NUM_DICE = 3;

// show header
console.log(`
DOBBELSTENEN
============
aantal deelnemers: ${players.length}`);

// throw dice
for (let i = 0; i < players.length; i++) {
    console.log(` ${players[i]} gooit: `);
const dice = [];
for (let j = 0; j < NUM_DICE; j++) {
    dice[j] = rnd;
}
scores[i] = getTotaal (dice);
console.log(`${diceToString(dice)} ( ${scores[i]} punten)`);
}

// show winner
console.log('\nWINNAAR: ');
document.body.style.backgroundColor = 'yellow';
document.body.style.color = 'black';
console.log(`${getWinner(scores, players)}`);

// methodes
function diceToString(dice) {
    let retval = '';
    for (const d of dice) {
        switch (d) {
            case 1: retval += '⚀ '; break;
            case 2: retval += '⚁ '; break;
            case 3: retval += '⚂ '; break;
            case 4: retval += '⚃ '; break;
            case 5: retval += '⚄ '; break;
            case 6: retval += '⚅ '; break;
            default: break;
            }    
    }
    return retval;
}

function getTotaal(dice) {
    let total = 0;
    for (const d of dice) {
        total += d;
    }
    return total;
}

function getWinner(totals, names) {
    let winnerIndex = 0;
    let draw = false;
    for (let i = 1; i < totals.length; i++) {
        if (totals[i] == totals[winnerIndex]) draw = true;
        else if (totals[i] > totals[winnerIndex]) {
            winnerIndex = i;
            draw = false;
        }
    }
    return draw ? 'gelijkspel' : names[winnerIndex];
}