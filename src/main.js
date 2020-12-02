// TODO: BUG - PLAYERS CAN BAD SLAP MULTIPLE TIMES

const headerMsg = document.querySelector('.js-header-message');
const centralCard = document.querySelector('.js-central-card');
const centralCardCount = document.querySelector('.js-central-card-count');
const centralCardEmptyState = document.querySelector('.js-central-card-empty');
const p1Hand = document.querySelector('.js-p1-hand');
const p2Hand = document.querySelector('.js-p2-hand');
const p1CardCount = document.querySelector('.js-p1-card-count');
const p2CardCount = document.querySelector('.js-p2-card-count');
const p1CardEmptyState = document.querySelector('.js-p1-card-empty');
const p2CardEmptyState = document.querySelector('.js-p2-card-empty');
const p1Wins = document.querySelector('.js-p1-wins');
const p2Wins = document.querySelector('.js-p2-wins');

// || INITIALIZE GAME

let game = Game.initializeGame();

// || EVENT LISTENERS

window.addEventListener('keypress', function(e) {
  game.handlePlayerActions(e);
}.bind(game), false);

window.addEventListener('load', updateWinCounts);

// || DEAL CARD

function dealCard(centralPile, activePlayer) {
  const cardSrc = centralPile[0].src;
  const centralCardImg = document.querySelector('.js-central-card-img');

  clearHeaderMsg();
  
  if (centralCardImg) {
    updatePlayerCardEmptyState(activePlayer);
    updateCentralCard(cardSrc, centralCardImg);
    updateCentralCardBorder(activePlayer, centralCardImg);
    updateCentralCardEmptyState(centralPile);
    updateCardCounts(activePlayer, centralPile);
    return;
  } 
  
  updateCentralCardEmptyState(centralPile);
  createFirstCentralCard(cardSrc, activePlayer, centralPile);
}

function createFirstCentralCard(cardSrc, activePlayer, centralPile) {
  createCentralCardImg(cardSrc, activePlayer);
  updateCardCounts(activePlayer, centralPile);
}

function createCentralCardImg(src, activePlayer) {
  const playerBorder = isPlayer1(activePlayer) ? 'p1-hand' : 'p2-hand';
  const cardImgHTML = `<img class="js-central-card-img ${playerBorder}" src="${src}" alt="">`;
  
  centralCard.insertAdjacentHTML('afterbegin', cardImgHTML);
}

function updateCentralCard(cardSrc, centralCardImg) {
  centralCardImg.src = cardSrc;
}

function updateCentralCardBorder(activePlayer, img) {
  if (!img) return;
  
  if (isPlayer1(activePlayer)) {
    img.classList.add('p1-hand');
    img.classList.remove('p2-hand');
  } else {
    img.classList.add('p2-hand');
    img.classList.remove('p1-hand');
  }
}

// || SLAP CARD

function slapCard(type, activePlayer, centralPile) {
  updateHeaderMsg(type, activePlayer.name);
  clearCentralCard();
  updateCentralCardEmptyState(centralPile);
  updatePlayerCardEmptyState(activePlayer);
  updateCardCounts(activePlayer, centralPile);
}

function badSlap(activePlayer, opponent) {
  updateHeaderMsg('Bad slap', activePlayer.name, opponent.name);
  updateCardCountBadSlap(activePlayer, opponent);
  resetPlayerCardStates();
}

// || GAME OVER 

function gameOver(activePlayer, opponent, type) {
  updateHeaderMsg(type, activePlayer.name, opponent.name);
  updateWinCounts();
  clearCentralCard();
  resetGame();
}

function resetGame() {
  resetCentralCardEmptyState();
  resetCardCounts();
  resetPlayerCardStates();
  resetHeaderMsg();
  game = Game.initializeGame();
}

function resetCardCounts() {
  p1CardCount.textContent = '26';
  p2CardCount.textContent = '26';
  centralCardCount.textContent = '0';
}

function resetPlayerCardStates() {
  p1CardEmptyState.hidden = true;
  p2CardEmptyState.hidden = true;
  p1Hand.hidden = false;
  p2Hand.hidden = false;
}

function resetCentralCardEmptyState() {
  centralCardEmptyState.hidden = false;
}

function resetHeaderMsg() {
  setTimeout(() => { 
    headerMsg.textContent = `Slap Jack!`;
  }, 3000);
}

function updatePlayerWinCount() {
  
}

// || MANAGE CARD COUNT

function updateCardCounts(activePlayer, centralPile) {
  centralCardCount.textContent = centralPile.length;

  if (isPlayer1(activePlayer)) {
    p1CardCount.textContent = activePlayer.hand.length;
    return;
  }

  p2CardCount.textContent = activePlayer.hand.length;
}

function updateCardCountBadSlap(activePlayer, opponent) {
  if (isPlayer1(activePlayer)) {
    p1CardCount.textContent = activePlayer.hand.length;
    p2CardCount.textContent = opponent.hand.length;
    return;
  }
  
  p1CardCount.textContent = opponent.hand.length;
  p2CardCount.textContent = activePlayer.hand.length;
}

// || HEADER MESSAGE

function clearHeaderMsg() {  
  headerMsg.textContent = '';
}

function updateHeaderMsg(type, playerName, opponentName) {
  if (type === 'Slap Jack' || type === 'Double' || type === 'Sandwich') {
    headerMsg.textContent = `${type}! ${playerName} takes the pile!`;
  }
  
  if (type === 'Bad slap') {
    headerMsg.textContent = `${type}! ${playerName} gives a card to ${opponentName}.`;
  }
  
  if (type === 'Game over') {
    headerMsg.textContent = `${type}! ${playerName} wins!`;
  }

  if (type === 'Game over illegal') {
    headerMsg.textContent = `Game over! ${opponentName} wins!`;
  }
}

function updatePlayerCardEmptyState(activePlayer) {
  const hand = isPlayer1(activePlayer) ? p1Hand : p2Hand;
  const cardEmptyState = isPlayer1(activePlayer) ? p1CardEmptyState : p2CardEmptyState;
  
  if (activePlayer.hand.length) {
    cardEmptyState.hidden = true;
    hand.hidden = false;
  } else {
    cardEmptyState.hidden = false;
    hand.hidden = true;
  }
}

function updateCentralCardEmptyState(centralPile) {
  if (centralPile.length) {
    centralCardEmptyState.hidden = true;
  } else {
    centralCardEmptyState.hidden = false;
  }
}

// WIN COUNTS
function updateWinCounts() {
  const winObj = JSON.parse(localStorage.getItem('wins'));
  p1Wins.textContent = winObj['Player 1'];
  p2Wins.textContent = winObj['Player 2'];
}

// || HELPERS

function clearCentralCard() {
  const centralCardImg = document.querySelector('.js-central-card-img');
  centralCardImg.remove();
}

function isPlayer1(activePlayer) {
  return activePlayer.name.includes('1');
}