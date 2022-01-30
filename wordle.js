const keyboard = document.querySelector('.keyboardkeys');
const boxes = document.querySelector('.boxes');
const keyboardtext = "QWERTYUIOPASDFGHJKLZXCVBNM";
const enter = document.querySelector('.enter');
const removekey = document.querySelector('.remove');
const giveupbutton = document.querySelector('.giveup');

let rowNo = 0;
let dataConstraints;
let dataWords;
let correctWord;
let difficulty = 5;

//generate word
async function getWord () {
    const response = await fetch ("https://random-word-api.herokuapp.com/all");
    const data = await response.json();
    dataWords = data.filter(word => word.length === difficulty);
    dataConstraints = dataWords.length;
    function random() {
        return Math.floor(Math.random()*dataConstraints);
    }
    correctWord = dataWords[random()].toUpperCase();
    return correctWord && dataWords;
}

window.onload = getWord();
alert("This is a wordle clone, with a volcabulary library sourced from https://random-word-api.herokuapp.com, including obscure and sometimes technical terms. The world doesn't need more of these, but it was fun building it anyway. You could use this to practice your Wordle skills while waiting for the next generated word on powerlanguage.co.uk/wordle/. Good Luck!");

//generate rows
for (let i=0; i<6; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    boxes.appendChild(row);
    for (let a=0; a<difficulty; a++) {
        const box = document.createElement('div');
        box.classList.add('box');
        row.appendChild(box);
    }
}

//generate keyboard remove + keys
function remove() {
    const newbox = document.querySelectorAll('.newbox');
    const box = document.createElement('div');
    if(row[rowNo].innerText.length>0) {
        box.classList.add('box');
        newbox[newbox.length-1].replaceWith(box);
    } else return;
}

const row = document.querySelectorAll('.row');

removekey.addEventListener('click', remove);

for (let key of keyboardtext) {
    const keyboardkey = document.createElement('span');
    keyboardkey.classList.add('keyboardkey')
    keyboardkey.innerText = key;
    keyboard.appendChild(keyboardkey);

    function typeIn () {
        if(row[rowNo].innerText.length < difficulty) {
            const box = document.querySelector('.box');
            const newbox = document.createElement('div');
            newbox.classList.add('newbox');
            newbox.innerText = keyboardkey.innerText;
            box.replaceWith(newbox);
        }
    }
    keyboardkey.addEventListener('click', typeIn);
}

//check the validity of word
async function verify () {
    if (dataWords.indexOf(`${row[rowNo].innerText.toLowerCase()}`) < 0)  {
        alert('Please Choose a Valid Word');
        rowNo = rowNo;
    } 
    else {
        for (let i=0; i<difficulty; i++) {
            const newbox = row[rowNo].querySelectorAll('.newbox');
            var findkey = document.evaluate(`//span[contains(., \'${row[rowNo].innerText[i]}\')]`, document, null, XPathResult.ANY_TYPE, null );
            var selectedkey = findkey.iterateNext();
            function verifyClass(newClass) {
                setTimeout(()=>newbox[i].classList.add(newClass),400*i);
            }
            if (correctWord.indexOf(row[rowNo].innerText[i]) > -1) {
                if(row[rowNo].innerText[i] === correctWord[i]) {
                    verifyClass('correct');
                    selectedkey.classList.add('correctkey');
                } else {
                    verifyClass('close');
                    selectedkey.classList.add('closekey');
                }
            } else {
                verifyClass('wrong');
                selectedkey.classList.add('wrongkey');
            } 
        }
        
        if(row[rowNo].innerText === correctWord) {
            setTimeout(() => alert('Congragulations!'), 500*difficulty);
        } else {rowNo = rowNo+1; 
            if (rowNo === 6) {
                setTimeout(() => {
                    alert(`The word was ${correctWord}. Refresh to try again.`);
                    location.reload();
                }, 500*difficulty);
                
            }};
    }
}

//generate submit and giveup buttons
function submit () { 
    verify();    
}

function giveup () { 
    confirm(`The word was ${correctWord}. Refresh to try again.`);
    location.reload();
}

enter.addEventListener('click', submit);
giveupbutton.addEventListener('click', giveup);

//keyboard function for players 
window.addEventListener('keydown', e => {
    if(row[rowNo].innerText.length < difficulty && keyboardtext.split('').indexOf(e.key.toUpperCase()) > -1) {
        const box = document.querySelector('.box');
        const newbox = document.createElement('div');
        newbox.classList.add('newbox');
        newbox.innerText = e.key.toUpperCase();
        box.replaceWith(newbox);
        console.log(e)
    } switch (e.key) {
        case 'Backspace': {
            remove();
            break;
        }
        case 'Enter': {
            submit();
            break;
        } 
    }
})

