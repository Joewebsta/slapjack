const headerMsg = document.querySelector('.js-header-message');
const centralCard = document.querySelector('.js-central-card');
const p1CardCount = document.querySelector('.js-p1-card-count');
const p2CardCount = document.querySelector('.js-p2-card-count');

const game = Game.initializeGame();
game.dealPlayerDecks();

window.addEventListener('keypress', function(e) {
  game.handlePlayerActions(e);
}.bind(game), false);

function dealCard(cardSrc, activePlayer) {
  const centralCardImg = document.querySelector('.js-central-card-img');
  const playerName = activePlayer.name;

  clearHeaderMsg();

  if (!centralCardImg) {
    createCentralCardImg(cardSrc, playerName);
    updateCardCount(activePlayer);
    return;
  }

  updateCentralCardSrc(cardSrc, centralCardImg);
  updateCentralCardBorder(playerName, centralCardImg);
  updateCardCount(activePlayer);
}

function createCentralCardImg(src, playerName) {
  const playerBorder = isPlayer1(playerName) ? 'player1-border' : 'player2-border';
  const cardImgHTML = `<img class="js-central-card-img ${playerBorder}" src="${src}" alt="">`;
  
  centralCard.insertAdjacentHTML('afterbegin', cardImgHTML);
}

function updateCentralCardSrc(cardSrc, centralCardImg) {
  centralCardImg.src = cardSrc;
}

function updateCentralCardBorder(playerName, img) {
  if (!img) return;
  
  if (isPlayer1(playerName)) {
    img.classList.add('player1-border');
    img.classList.remove('player2-border');
  } else {
    img.classList.add('player2-border');
    img.classList.remove('player1-border');
  }
}

function updateCardCount(activePlayer) {
  if (isPlayer1(activePlayer.name)) {
    p1CardCount.textContent = activePlayer.hand.length;
    return;
  }

  p2CardCount.textContent = activePlayer.hand.length;
}

function slapCard(type, activePlayer) {
  console.log(type);
  updateHeaderMsg(type, activePlayer.name);
  updateCardCount(activePlayer);
  clearCentralCard();
}

function badSlap(activePlayer, opponent) {
  updateHeaderMsg('Bad slap', activePlayer.name, opponent.name);
  updateCardCountBadSlap(activePlayer, opponent);
}

function updateCardCountBadSlap(activePlayer, opponent) {
  if (isPlayer1(activePlayer.name)) {
    p1CardCount.textContent = activePlayer.hand.length;
    p2CardCount.textContent = opponent.hand.length;
    return;
  }
  
  p1CardCount.textContent = opponent.hand.length;
  p2CardCount.textContent = activePlayer.hand.length;
}

function clearCentralCard() {
  const centralCardImg = document.querySelector('.js-central-card-img');
  centralCardImg.remove();
}

function clearHeaderMsg() {  
  headerMsg.textContent = '';
}

function updateHeaderMsg(type, playerName, opponent) {
  if (type === 'Slap Jack' || type === 'Double' || type === 'Sandwich') {
    headerMsg.textContent = `${type}! ${playerName} takes the pile!`;
  }
  
  if (type === 'Bad slap') {
    headerMsg.textContent = `${type}! ${playerName} gives a card to ${opponent}.`;
  }
}

function isPlayer1(playerName) {
  return playerName.includes('1');
}