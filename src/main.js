const centralCard = document.querySelector('.js-central-card');

const game = Game.initializeGame();
game.dealPlayerDecks();

window.addEventListener('keypress', function(e) {
  game.handlePlayerActions(e);
}.bind(game), false);

function updateCentralCard(cardSrc) {
  const centralCardImg = document.querySelector('.js-central-card-img');

  if (!centralCardImg) {
    createCentralCardImg(cardSrc);
    return;
  }
  
  centralCardImg.src = cardSrc;
}

function createCentralCardImg(src) {
  const cardImgHTML = `<img class="js-central-card-img" src="${src}" alt="">`;
  centralCard.insertAdjacentHTML('afterbegin', cardImgHTML);
}