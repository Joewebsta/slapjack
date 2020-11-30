class Game {

  static initializeGame() {
    this.initializeStorage();

    const cards = this.shuffleCards(this.createCards());
    const player1 = new Player('Player 1', this.dealPlayerDecks(cards)[0]);
    const player2 = new Player('Player 2', this.dealPlayerDecks(cards)[1]);
    return new Game(player1, player2, cards);
  }

  static createCards() {
    return cardImgSrc.reduce((cardArr, cardFileName) => {
      const cardProps = cardFileName.substr(0, cardFileName.length - 4).split('-');
      const color = cardProps[0];
      const value = cardProps[1];
      cardArr.push(new Card(color, value, `../assets/${cardFileName}`));
      return cardArr;
    }, []);
  }

  static dealPlayerDecks(cards) {
    const midCardIdx = (cards.length / 2);
    const p1Cards = cards.slice(0, midCardIdx);
    const p2Cards = cards.slice(midCardIdx);
    return [p1Cards, p2Cards];
  }

  static shuffleCards(cards) {
    const shuffledCards = [];
    while (cards.length) {
      const randIdx = Math.floor(Math.random() * cards.length);
      shuffledCards.push(cards[randIdx]);
      cards.splice(randIdx, 1);
    }

    return shuffledCards;
  }
  
  static initializeStorage() {
    const wins = { 'Player 1' : 0, 'Player 2' : 0 };

    if (!localStorage.getItem('wins')) {
      localStorage.setItem('wins', JSON.stringify(wins));
    }
  }

  constructor(player1, player2, cards) {
    this.player1 = player1;
    this.player2 = player2;
    this.cards = this.shuffleCards(cards);
    this.centralPile = [];
    this.currentPlayerTurn = this.player1;

    this.initializeStorage();
  }

  shuffleCards(cards) {
    const shuffledCards = [];
    while (cards.length) {
      const randIdx = Math.floor(Math.random() * cards.length);
      shuffledCards.push(cards[randIdx]);
      cards.splice(randIdx, 1);
    }

    return shuffledCards;
  }

  dealPlayerDecks() {
    const midCardIdx = (this.cards.length / 2);
    this.player1.hand = this.cards.slice(0, midCardIdx);
    this.player2.hand = this.cards.slice(midCardIdx);
  }

  // || PLAYER ACTIONS

  handlePlayerActions(e) {  
    const activePlayer = this.activePlayer(e);
    const opponent = this.playerOpponent(activePlayer);
    
    if (this.isPlayerDeal(e)) {
      this.handlePlayerDeal(activePlayer, opponent);
    }
    
    if (this.isPlayerSlap(e)) {
      this.handlePlayerSlap(activePlayer, opponent);
    }
  }

  playerOpponent(player) {
    return player === this.player1 ? this.player2 : this.player1;
  }

  activePlayer(e) {
    if (e.key === 'q' || e.key === 'f') return this.player1;
    if (e.key === 'p' || e.key === 'j') return this.player2;
  }

  isPlayerDeal(e) {
    return (e.key === 'q' || e.key === 'p');
  }

  isPlayerSlap(e) {
    return (e.key === 'f' || e.key === 'j');
  } 

  // || DEAL CARD

  handlePlayerDeal(activePlayer, opponent) {
    if (!activePlayer.isPlayerTurn(this.currentPlayerTurn)) return;
    if (!activePlayer.hasCards()) return;

    this.dealCard(activePlayer, opponent);
  }

  dealCard(activePlayer, opponent) {
    this.centralPile.unshift(activePlayer.playCard());
    this.updateCurrentPlayerTurn(activePlayer, opponent);
    dealCard(this.centralPile, activePlayer);

    console.log(`${this.centralPile[0].value} -- Player 1 cards: ${this.player1.hand.length}. -- Player 2 cards: ${this.player2.hand.length}.`);
  }

  // || SLAP CARD

  handlePlayerSlap(activePlayer, opponent) {
    if (!this.centralPile.length) return;
    
    if (this.isIllegalSlap()) {
      this.handleIllegalSlap(activePlayer, opponent);
      return;
    }

    this.handleLegalSlap(activePlayer, opponent);
  }

  handleLegalSlap(activePlayer, opponent) {
    
    if (activePlayer.hasCards() && !opponent.hasCards()) {
     this.slapScenario1(activePlayer, opponent);
     return;
    }
    
    if (!activePlayer.hasCards() && opponent.hasCards()) {
      this.slapScenario2(activePlayer, opponent); 
      return;
    }
    
    this.slapScenario3(activePlayer, opponent);
  }

  slapScenario1(activePlayer, opponent) {
    if (this.isDouble()) {
      this.slap(activePlayer, opponent, 'Double');
      return;
    }
    
    if (this.isSandwich()) {
      this.slap(activePlayer, opponent, 'Sandwich');
      return;
    }

    if (this.isJack()) {
      console.log(`Game over - ${activePlayer.name} wins - ${opponent.name} loses!`);
      this.resetGame();
      activePlayer.updateWins();
      activePlayer.saveWinsToStorage();
      gameOver(activePlayer, opponent, 'Game over');
      return;
    }
  }
  
  slapScenario2(activePlayer, opponent) {
    if (this.isJack()) {
      this.slap(activePlayer, opponent, 'Slap Jack');
      return;
    }

    if (this.isDouble() || this.isSandwich()) {
      console.log(`Game over - ${opponent.name} wins - ${activePlayer.name} loses!`);
      this.resetGame();
      opponent.updateWins();
      opponent.saveWinsToStorage();
      gameOver(activePlayer, opponent, 'Game over illegal');
      return;
    }
  }

  slapScenario3(activePlayer, opponent) {
    if (this.isJack()) {
      this.slap(activePlayer, opponent, 'Slap Jack');
    }
    
    if (this.isDouble()) {
      this.slap(activePlayer, opponent, 'Double');
    }

    if (this.isSandwich()) {
      this.slap(activePlayer, opponent, 'Sandwich');
    }
  }

  handleIllegalSlap(activePlayer, opponent) {
    // console.log('Illegal slap!');
    
    if (!activePlayer.hasCards()) {
      console.log(`Game over ${activePlayer.name} loses!`);
      this.resetGame();
      opponent.updateWins();
      opponent.saveWinsToStorage();
      gameOver(activePlayer, opponent, 'Game over illegal');
      return;
    }

    this.transferCardToOpponent(activePlayer, opponent);
    badSlap(activePlayer, opponent);
  }

  slap(activePlayer, opponent, type) {
    this.collectCentralPile(activePlayer);  
    this.updateCurrentPlayerTurn(activePlayer, opponent);
    this.resetCentralPile();

    slapCard(type, activePlayer, this.centralPile);
    // console.log(`${activePlayer.name} legal and succesful slap!`);
  }

// || SLAP OUTCOMES

  transferCardToOpponent(activePlayer, opponent) {
    opponent.hand.push(activePlayer.hand.shift());
    this.updateCurrentPlayerTurn(activePlayer, opponent);
  }

  collectCentralPile(activePlayer) {
    activePlayer.hand = activePlayer.hand.concat(this.centralPile);
    activePlayer.hand = this.shuffleCards(activePlayer.hand);
  }

  updateCurrentPlayerTurn(activePlayer, opponent) {
    if (!opponent.hasCards()) return;
    this.currentPlayerTurn = (activePlayer === this.player1 ? this.player2 : this.player1);
  }

  resetGame() {
    this.cards = this.shuffleCards(this.cards);
    this.dealPlayerDecks();
    this.resetCentralPile();
    this.currentPlayerTurn = this.player1;
  }

  // || SLAP CONDITIONALS

  isIllegalSlap() {
    return !this.isJack() && !this.isDouble() && !this.isSandwich();
  }

  isJack() {
    return this.centralPile[0].value === 'jack';
  }

  isDouble() {
    if (this.centralPile.length >= 2) {
      return this.centralPile[0].value === this.centralPile[1].value;
    }
  }

  isSandwich() {
    if (this.centralPile.length >= 3) {
      return this.centralPile[0].value === this.centralPile[2].value;
    }
  }

  // INITIALIZE STORAGE

  initializeStorage() {    
    const wins = { 'Player 1' : 0, 'Player 2' : 0 };

    if (!localStorage.getItem('wins')) {
      localStorage.setItem('wins', JSON.stringify(wins));
    }
  }

  // || UTILITIES
  
  resetCentralPile() {
    this.centralPile = [];
  }
}
