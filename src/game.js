class Game {

  // CLASS METHODS

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

  // INSTANCE METHODS

  constructor(player1, player2, cards) {
    this.player1 = player1;
    this.player2 = player2;
    this.cards = cards;
    this.centralPile = [];
    this.currentPlayerTurn = this.player1;
    this.activePlayer = '';
    this.opponent = '';
  }

  // || DETERMINE DEAL OR SLAP

  handlePlayerActions(e) {      
    this.activePlayer = this.determineActivePlayer(e);
    this.opponent = this.determineOpponent(this.activePlayer);
    
    if (this.isPlayerDeal(e)) {
      this.handlePlayerDeal();
    }
    
    if (this.isPlayerSlap(e)) {
      this.handlePlayerSlap();
    }
  }

  // || DEAL CARD

  handlePlayerDeal() {
    if (!this.activePlayer.isPlayerTurn(this.currentPlayerTurn)) return;
    if (!this.activePlayer.hasCards()) return;
    
    this.dealCard();
    this.updateCurrentPlayerTurn();
    
    dealCard(this.centralPile, this.activePlayer);
  }

  dealCard() {
    this.centralPile.unshift(this.activePlayer.playCard());

    console.log(`${this.centralPile[0].value} -- Player 1 cards: ${this.player1.hand.length}. -- Player 2 cards: ${this.player2.hand.length}.`);
  }

  // || SLAP CARD

  handlePlayerSlap() {
    if (!this.centralPile.length) return;
    
    if (this.activePlayer.hasCards() && !this.opponent.hasCards()) {
      this.slapScenario1();
      return;
     }
     
     if (!this.activePlayer.hasCards() && this.opponent.hasCards()) {
       this.slapScenario2(); 
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
      this.activePlayer.updateWins();
      this.activePlayer.saveWinsToStorage();
      
      gameOver(this.activePlayer, this.opponent, 'Game over');
      
      console.log(`Game over - ${this.activePlayer.name} wins - ${this.opponent.name} loses!`);
      return;
    }
  }
  
  slapScenario2() {
    if (this.isJack()) {
      this.slap('Slap Jack');
      return;
    }

    if (!this.isJack()) {
      this.opponent.updateWins();
      this.opponent.saveWinsToStorage();
      
      gameOver(this.activePlayer, this.opponent, 'Game over illegal');
      
      console.log(`Game over - ${this.opponent.name} wins - ${this.activePlayer.name} loses!`);
    }
  }

  slapScenario3() {
    if (this.isBadSlap()) {
      this.transferCardToOpponent();
      
      badSlap(this.activePlayer, this.opponent);
      return;
    }

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

  slap(type) {
    this.collectCentralPile(this.activePlayer);  
    this.updateCurrentPlayerTurn();
    this.resetCentralPile();

    slapCard(type, this.activePlayer, this.centralPile);
  }

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
  
  // || HELPERS

  determineActivePlayer(e) {
    if (e.key === 'q' || e.key === 'f') return this.player1;
    if (e.key === 'p' || e.key === 'j') return this.player2;
  }
  
  determineOpponent() {
    return this.activePlayer === this.player1 ? this.player2 : this.player1;
  }

  isPlayerDeal(e) {
    return (e.key === 'q' || e.key === 'p');
  }

  isPlayerSlap(e) {
    return (e.key === 'f' || e.key === 'j');
  }
  
  isBadSlap() {
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

  shuffleCards(cards) {
    const shuffledCards = [];
    while (cards.length) {
      const randIdx = Math.floor(Math.random() * cards.length);
      shuffledCards.push(cards[randIdx]);
      cards.splice(randIdx, 1);
    }

    return shuffledCards;
  }
}