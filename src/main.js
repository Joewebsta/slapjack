const centralCard = document.querySelector('.js-central-card');
const headerMsg = document.querySelector('.js-header-message');

const game = Game.initializeGame();
game.dealPlayerDecks();

window.addEventListener('keypress', function(e) {
  game.handlePlayerActions(e);
}.bind(game), false);

function dealCard(cardSrc, playerName) {
  const centralCardImg = document.querySelector('.js-central-card-img');

  clearHeaderMsg();
  updateCentralCardSrc(cardSrc, playerName, centralCardImg);
  updateCentralCardBorder(playerName, centralCardImg);
}

function createCentralCardImg(src, playerName) {
  const playerBorder = playerName.includes('1') ? 'player1-border' : 'player2-border';
  const cardImgHTML = `<img class="js-central-card-img ${playerBorder}" src="${src}" alt="">`;
  
  centralCard.insertAdjacentHTML('afterbegin', cardImgHTML);
}

function updateCentralCardSrc(cardSrc, playerName, centralCardImg) {
  if (!centralCardImg) {
    createCentralCardImg(cardSrc, playerName);
    return;
  }
  
  centralCardImg.src = cardSrc;
}

function updateCentralCardBorder(playerName, img) {
  if (!img) return;
  
  if (playerName.includes('1')) {
    img.classList.add('player1-border');
    img.classList.remove('player2-border');
  } else {
    img.classList.add('player2-border');
    img.classList.remove('player1-border');
  }
}

function slapCard(type, playerName) {
  console.log(type);
  updateHeaderMsg(type, playerName);
  clearCentralCard();
}

function clearCentralCard() {
  const centralCardImg = document.querySelector('.js-central-card-img');
  centralCardImg.remove();
}

function clearHeaderMsg() {  
  headerMsg.textContent = '';
}

function updateHeaderMsg(type, playerName) {
  if (type === 'Slap Jack' || type === 'Double' || type === 'Sandwich') {
    headerMsg.textContent = `${type}! ${playerName} takes the pile!`;
  }
}