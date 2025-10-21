// Dados das palavras por nível
const palavrasNivel1 = {
  "BOLA":["BO","LA"],
  "CASA":["CA","SA"],
  "DADO":["DA","DO"],
  "GATO":["GA","TO"],
  "MALA":["MA","LA"]
};

const palavrasNivel2 = {
  "MACACO":["MA","CA","CO"],
  "JANELA":["JA","NE","LA"],
  "SAPATO":["SA","PA","TO"],
  "CANETA":["CA","NE","TA"],
  "PIPOCA":["PI","PO","CA"]
};

const silabasExtras = ["PI","FE","LU","RI","TE","MO","BA","NA","RA"];

let allWords = {...palavrasNivel1, ...palavrasNivel2};
let sequence = [];
let currentIdx = 0;
let score = 0;

const nivelSelect = document.getElementById('nivel');
const btnStart = document.getElementById('btn-start');
const btnCheck = document.getElementById('btn-check');
const btnNext = document.getElementById('btn-next');
const syllablesDiv = document.getElementById('syllables');
const dropZone = document.getElementById('drop-zone');
const targetWord = document.getElementById('target-word');
const scoreDiv = document.getElementById('score');
const feedback = document.getElementById('feedback');
const figure = document.getElementById('figure');

function shuffle(a){ return a.sort(()=>Math.random()-0.5) }

function startGame(){
  score = 0;
  currentIdx = 0;
  scoreDiv.textContent = 'Pontuação: 0';
  feedback.textContent = '';
  const nivel = parseInt(nivelSelect.value,10);
  // define sequence por nível
  let pool = [];
  if(nivel===1){
    pool = Object.keys(palavrasNivel1);
  } else if(nivel===2){
    pool = Object.keys({...palavrasNivel1,...palavrasNivel2});
  } else {
    pool = Object.keys({...palavrasNivel1,...palavrasNivel2});
  }
  sequence = shuffle(pool.slice());
  prepareRound();
}

function prepareRound(){
  if(currentIdx >= sequence.length){
    endGame();
    return;
  }
  feedback.textContent = '';
  const word = sequence[currentIdx];
  const correct = allWords[word];
  // set figure emoji simple mapping (can be replaced by imagens)
  const emojiMap = {
    "BOLA":"⚽","CASA":"🏠","DADO":"🎲","GATO":"🐱","MALA":"🧳",
    "MACACO":"🐒","JANELA":"🪟","SAPATO":"👞","CANETA":"🖊️","PIPOCA":"🍿"
  };
  figure.textContent = emojiMap[word] || '🖼️';
  targetWord.textContent = 'Palavra: ' + word;
  dropZone.innerHTML = '<div class="placeholder">Arraste as sílabas aqui</div>';
  dropZone.dataset.expected = correct.join(',');
  // create options
  let options = correct.concat(shuffle(silabasExtras).slice(0,4));
  options = shuffle(options);
  syllablesDiv.innerHTML = '';
  options.forEach(s=>{
    const btn = document.createElement('button');
    btn.className = 'syll-btn';
    btn.draggable = true;
    btn.textContent = s;
    btn.addEventListener('click', ()=> addSyllable(s));
    btn.addEventListener('dragstart', (e)=>{ e.dataTransfer.setData('text/plain', s); });
    syllablesDiv.appendChild(btn);
  });
  btnCheck.disabled = false;
  btnNext.disabled = true;
}

function addSyllable(s){
  // remove placeholder
  const ph = dropZone.querySelector('.placeholder');
  if(ph) ph.remove();
  const span = document.createElement('div');
  span.className = 'syll';
  span.textContent = s;
  dropZone.appendChild(span);
}

dropZone.addEventListener('dragover', (e)=>{ e.preventDefault(); });
dropZone.addEventListener('drop', (e)=>{
  e.preventDefault();
  const s = e.dataTransfer.getData('text/plain');
  if(s){
    addSyllable(s);
  }
});

btnCheck.addEventListener('click', ()=>{
  const expected = dropZone.dataset.expected.split(',');
  const chosenEls = Array.from(dropZone.querySelectorAll('.syll'));
  const chosen = chosenEls.map(el=>el.textContent);
  if(chosen.length !== expected.length){
    feedback.textContent = '🔔 Escolha todas as sílabas na ordem correta.';
    return;
  }
  if(chosen.join(',') === expected.join(',')){
    score += 10;
    scoreDiv.textContent = 'Pontuação: ' + score;
    feedback.textContent = '🎉 PARABÉNS! Você formou a palavra!';
  } else {
    feedback.textContent = '😅 Quase! A forma certa: ' + expected.join('-');
  }
  btnCheck.disabled = true;
  btnNext.disabled = false;
});

btnNext.addEventListener('click', ()=>{
  currentIdx++;
  prepareRound();
});

function endGame(){
  feedback.textContent = '🏁 Fim de jogo! Pontuação final: ' + score;
  btnCheck.disabled = true;
  btnNext.disabled = true;
  targetWord.textContent = 'Fim!';
}

btnStart.addEventListener('click', startGame);

// Accessibility: keyboard support for selecting syllables
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && btnCheck && !btnCheck.disabled){
    btnCheck.click();
  }
});