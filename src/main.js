window.addEventListener('load', initializeGame);

function initializeGame() {
  const cards = createCards();
  const player1 = new Player('Player 1');
  const player2 = new Player('Player 2');
  const game = new Game(player1, player2, cards);
  
  game.cards = game.shuffleCards(game.cards);
  // game.dealPlayerDecks();
  
  console.log(game);
}

function createCards() {
  return cardImgSrc.reduce((cardArr, cardFileName) => {
    const cardProps = cardFileName.substr(0, cardFileName.length - 4).split('-');
    const color = cardProps[0];
    const suit = cardProps[1];
    cardArr.push(new Card(color, suit, `../assets/${cardFileName}`));
    return cardArr;
  }, []);
}