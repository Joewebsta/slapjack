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
    if (e.key === 'q' || e.key === 'p') this.dealCard(e);
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
}

// Player slaps card