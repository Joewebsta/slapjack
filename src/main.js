const centralCard = document.querySelector('.js-central-card');

const game = Game.initializeGame();
game.dealPlayerDecks();

window.addEventListener('keypress', function(e) {
  game.handlePlayerActions(e);
}.bind(game), false);

function updateCentralCard(cardSrc, playerName) {
  const centralCardImg = document.querySelector('.js-central-card-img');

  if (!centralCardImg) {
    createCentralCardImg(cardSrc, playerName);
    return;
  }
  
  centralCardImg.src = cardSrc;
  updateCentralCardBorder(playerName, centralCardImg);
}

function createCentralCardImg(src, playerName) {
  const playerBorder = playerName.includes('1') ? 'player1-border' : 'player2-border';
  const cardImgHTML = `<img class="js-central-card-img ${playerBorder}" src="${src}" alt="">`;
  
  centralCard.insertAdjacentHTML('afterbegin', cardImgHTML);
}

function updateCentralCardBorder(playerName, img) {
  if (playerName.includes('1')) {
    img.classList.add('player1-border');
    img.classList.remove('player2-border');
  } else {
    img.classList.add('player2-border');
    img.classList.remove('player1-border');
  }
}