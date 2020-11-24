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
      const randIdx = Math.round(Math.random() * (cards.length - 1));
      shuffledCards.push(cards[randIdx]);
      cards.splice(randIdx, 1);
    }

    return shuffledCards;
  }

  dealPlayerDecks() {
    this.player1.hand = this.cards.slice(0, 26);
    this.player2.hand = this.cards.slice(26, 52);
  }

  handlePlayerActions(e) {
    if (e.key === 'q' || e.key === 'p') {
      this.dealCard(e);
    }
    
    if (e.key === 'f' || e.key === 'j') {
      this.slapCard(e);
    }
  }

  dealCard(e) {
    if (e.key === 'q' && this.currentPlayerTurn === this.player1) {
      this.centralPile.unshift(this.player1.playCard());
      this.currentPlayerTurn = this.player2;
      console.log(this.centralPile[0].suit);
    }

    if (e.key === 'p' && this.currentPlayerTurn === this.player2) {
      this.centralPile.unshift(this.player2.playCard());
      this.currentPlayerTurn = this.player1;
      console.log(this.centralPile[0].suit);
    }
  }

  slapCard(e) {
    if ((e.key === 'f' || e.key === 'j') && !this.centralPile.length) return;

    if (this.centralPile[0].suit === 'jack') { //OR isDouble OR isSandwich
      this.legalSlap(e);
    } else {
      this.illegalSlap(e);
    }
  }

  legalSlap(e) {
    if (e.key == 'f') {
      this.player1.hand = this.player1.hand.concat(this.centralPile);
      this.player1.hand = this.shuffleCards(this.player1.hand);
      this.currentPlayerTurn = this.player1;
    }
    
    if (e.key == 'j') {
      this.player2.hand = this.player2.hand.concat(this.centralPile);
      this.player2.hand = this.shuffleCards(this.player2.hand);
      this.currentPlayerTurn = this.player2;
    }
    
    this.centralPile = [];
  }

  illegalSlap() {
    console.log('Illegal slap!');
  }
}