window.addEventListener('load', initializeGame);

function initializeGame() {
  new Game(createCards());
}

function createCards() {
  return cardImgSrc.reduce((cardArr, cardFileName) => {
    const cardProps = cardFileName.substr(0, cardFileName.length - 4).split('-');
    const color = cardProps[0];
    const suit = cardProps[1];
    cardArr.push(new Card(color, suit, cardFileName));
    return cardArr;
  }, []);
}