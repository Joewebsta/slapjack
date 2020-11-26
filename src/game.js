class Game {

  constructor(player1, player2, cards) {
    this.player1 = player1;
    this.player2 = player2;
    this.cards = cards;
    this.centralPile = [];
    this.currentPlayerTurn = this.player1;
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
    const lastCardIdx = this.cards.length;
    this.player1.hand = this.cards.slice(0, midCardIdx);
    this.player2.hand = this.cards.slice(midCardIdx, lastCardIdx);
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

    console.log(`${this.centralPile[0].value} -- Player 1 cards: ${this.player1.hand.length}. -- Player 2 cards: ${this.player2.hand.length}.`);
  }

  // || SLAP CARD

  handlePlayerSlap(activePlayer, opponent) {
    if (!this.centralPile.length) return;
    
    // TODO: HOW TO PREVENT MULTIPLE SLAPS BACK TO BACK?

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
    
    this.slap(activePlayer, opponent);
  }

  slapScenario1(activePlayer, opponent) {
    if (this.isDouble() || this.isSandwich()) {
      this.slap(activePlayer, opponent);
      return;
    }

    if (this.isJack()) {
      console.log(`Game over - ${activePlayer.name} wins - ${opponent.name} loses!`);
      return;
    }
  }
  
  slapScenario2(activePlayer, opponent) {
    if (this.isJack()) {
      this.slap(activePlayer, opponent);
      return;
    }

    if (this.isDouble() || this.isSandwich()) {
      console.log(`Game over - ${opponent.name} wins - ${activePlayer.name} loses!`);
      return;
    }
  }

  handleIllegalSlap(activePlayer, opponent) {
    console.log('Illegal slap!');
    
    if (!activePlayer.hasCards()) {
      console.log(`Game over ${activePlayer.name} loses!`);
      return;
    }
    
    this.transferCardToOpponent(activePlayer, opponent);
  }

  slap(activePlayer, opponent) {
    this.collectCentralPile(activePlayer);  
    this.updateCurrentPlayerTurn(activePlayer, opponent);
    this.centralPile = [];
    console.log(`${activePlayer.name} legal and succesful slap!`);
  }

// || SLAP OUTCOMES

  transferCardToOpponent(activePlayer, opponent) {
    opponent.hand.push(activePlayer.hand.shift());
    this.updateCurrentPlayerTurn(activePlayer, opponent);
    // this.player1.lastAction = 'illegal';
  }

  collectCentralPile(activePlayer) {
    activePlayer.hand = activePlayer.hand.concat(this.centralPile);
    activePlayer.hand = this.shuffleCards(activePlayer.hand);
  }

  updateCurrentPlayerTurn(activePlayer, opponent) {
    if (!opponent.hasCards()) return;
    this.currentPlayerTurn = (activePlayer === this.player1 ? this.player2 : this.player1);
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
}