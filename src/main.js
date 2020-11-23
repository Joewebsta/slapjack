window.addEventListener('load', initializeGame);

function initializeGame() {
  const game = new Game(createCards());
  const shuffledCards = game.shuffleCards(game.cards);
  console.log(shuffledCards);
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