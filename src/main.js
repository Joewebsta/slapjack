const centralCardImg = document.querySelector('.js-central-card-img');

const game = Game.initializeGame();
game.dealPlayerDecks();

window.addEventListener('keypress', function(e) {
  game.handlePlayerActions(e);
}.bind(game), false);

function updateCentralCard(cardSrc) {
  centralCardImg.src = cardSrc;
}