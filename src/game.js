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
      const value = cardProps[1];
      cardArr.push(new Card(value, `../assets/${cardFileName}`));
      return cardArr;
    }, []);
  }

  static dealPlayerDecks(cards) {
    const p1Cards = cards.slice(0, 26);
    const p2Cards = cards.slice(26);
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
    if (!localStorage.getItem('wins')) {
      const wins = { 'Player 1' : 0, 'Player 2' : 0 };
      localStorage.setItem('wins', JSON.stringify(wins));
    }
  }

  constructor(player1, player2, cards) {
    this.player1 = player1;
    this.player2 = player2;
    this.cards = this.shuffleCards(cards);
    this.centralPile = [];
    this.currentPlayerTurn = this.player1;
    this.activePlayer = '';
    this.opponent = '';
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

  // || PLAYER ACTIONS

  handlePlayerActions(e) {      
    this.activePlayer = this.determineActivePlayer(e);
    this.opponent = this.playerOpponent(this.activePlayer);
    
    if (this.isPlayerDeal(e)) {
      this.handlePlayerDeal();
    }
    
    if (this.isPlayerSlap(e)) {
      this.handlePlayerSlap();
    }
  }

  playerOpponent(player) {
    return player === this.player1 ? this.player2 : this.player1;
  }

  determineActivePlayer(e) {
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

  handlePlayerDeal() {
    if (!this.activePlayer.isPlayerTurn(this.currentPlayerTurn)) return;
    if (!this.activePlayer.hasCards()) return;

    this.dealCard();
  }

  dealCard() {
    this.centralPile.unshift(this.activePlayer.playCard());
    this.updateCurrentPlayerTurn(this.activePlayer, this.opponent);
    dealCard(this.centralPile, this.activePlayer);

    console.log(`${this.centralPile[0].value} -- Player 1 cards: ${this.player1.hand.length}. -- Player 2 cards: ${this.player2.hand.length}.`);
  }

  // || SLAP CARD

  handlePlayerSlap() {
    if (!this.centralPile.length) return;
    
    if (this.isIllegalSlap()) {
      this.handleIllegalSlap(this.activePlayer, this.opponent);
      return;
    }

    this.handleLegalSlap();
  }

  handleLegalSlap() {
    
    if (this.activePlayer.hasCards() && !this.opponent.hasCards()) {
     this.slapScenario1(this.activePlayer, this.opponent);
     return;
    }
    
    if (!this.activePlayer.hasCards() && this.opponent.hasCards()) {
      this.slapScenario2(this.activePlayer, this.opponent); 
      return;
    }
    
    this.slapScenario3();
  }

  slapScenario1() {
    if (this.isDouble()) {
      this.slap('Double');
      return;
    }
    
    if (this.isSandwich()) {
      this.slap('Sandwich');
      return;
    }

    if (this.isJack()) {
      console.log(`Game over - ${this.activePlayer.name} wins - ${this.opponent.name} loses!`);
      this.activePlayer.updateWins();
      this.activePlayer.saveWinsToStorage();
      gameOver(this.activePlayer, this.opponent, 'Game over');
      return;
    }
  }
  
  slapScenario2() {
    if (this.isJack()) {
      this.slap('Slap Jack');
      return;
    }

    if (this.isDouble() || this.isSandwich()) {
      console.log(`Game over - ${this.opponent.name} wins - ${this.activePlayer.name} loses!`);
      this.opponent.updateWins();
      this.opponent.saveWinsToStorage();
      gameOver(this.activePlayer, this.opponent, 'Game over illegal');
      return;
    }
  }

  slapScenario3() {
    if (this.isJack()) {
      this.slap('Slap Jack');
    }
    
    if (this.isDouble()) {
      this.slap('Double');
    }

    if (this.isSandwich()) {
      this.slap('Sandwich');
    }
  }

  handleIllegalSlap() {
    if (!this.activePlayer.hasCards()) {
      console.log(`Game over ${this.activePlayer.name} loses!`);
      this.opponent.updateWins();
      this.opponent.saveWinsToStorage();
      gameOver(this.activePlayer, this.opponent, 'Game over illegal');
      return;
    }

    this.transferCardToOpponent();
    badSlap(this.activePlayer, this.opponent);
  }

  slap(type) {
    this.collectCentralPile(this.activePlayer);  
    this.updateCurrentPlayerTurn(this.activePlayer, this.opponent);
    this.resetCentralPile();

    slapCard(type, this.activePlayer, this.centralPile);
  }

// || SLAP OUTCOMES

  transferCardToOpponent() {
    this.opponent.hand.push(this.activePlayer.hand.shift());
    this.updateCurrentPlayerTurn();
  }

  collectCentralPile() {
    this.activePlayer.hand = this.activePlayer.hand.concat(this.centralPile);
    this.activePlayer.hand = this.shuffleCards(this.activePlayer.hand);
  }

  updateCurrentPlayerTurn() {
    if (!this.opponent.hasCards()) return;
    this.currentPlayerTurn = (this.activePlayer === this.player1 ? this.player2 : this.player1);
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
  
  resetCentralPile() {
    this.centralPile = [];
  }
}