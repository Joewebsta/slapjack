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
    const midCardIdx = (this.cards.length / 2);
    const lastCardIdx = this.cards.length;
    this.player1.hand = this.cards.slice(0, midCardIdx);
    this.player2.hand = this.cards.slice(midCardIdx, lastCardIdx);
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
    // Prevent players from dealing a card when their hand is empty.
    if (e.key === 'q' && !this.player1.hand.length) {
      console.log('Player 1 is out of cards!');
      this.currentPlayerTurn = this.player2;
      return;
    }

    if (e.key === 'p' && !this.player2.hand.length) {
      console.log('Player 2 is out of cards!');
      this.currentPlayerTurn = this.player1;
      return;
    }

    // Deal a card and add it to central pile. Pass turn to opponent.
    if (e.key === 'q' && this.currentPlayerTurn === this.player1) {
      this.centralPile.unshift(this.player1.playCard());
      this.currentPlayerTurn = this.player2;
      this.player1.lastAction = 'deal';
      console.log(this.centralPile[0].value);
    }

    if (e.key === 'p' && this.currentPlayerTurn === this.player2) {
      this.centralPile.unshift(this.player2.playCard());
      this.currentPlayerTurn = this.player1;
      this.player2.lastAction = 'deal';
      console.log(this.centralPile[0].value);
    }

    // Reclaim turn if opponenet is out of cards
    if (e.key === 'q' && !this.player2.hand.length) {
      this.currentPlayerTurn = this.player1;
    }

    if (e.key === 'p' && !this.player1.hand.length) {
      this.currentPlayerTurn = this.player2;
    }
  }

  slapCard(e) {
    if ((e.key === 'f' || e.key === 'j') && !this.centralPile.length) return;

    if (this.isJack() || this.isDouble() || this.isSandwich()) {
      this.legalSlap(e);
    } else {
      this.illegalSlap(e);
    }
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

  legalSlap(e) {
    if (e.key == 'f') {
      this.player1.hand = this.player1.hand.concat(this.centralPile);
      this.player1.hand = this.shuffleCards(this.player1.hand);
      this.currentPlayerTurn = this.player1;
      console.log('Player 1 succesful slap!');
    }
    
    if (e.key == 'j') {
      this.player2.hand = this.player2.hand.concat(this.centralPile);
      this.player2.hand = this.shuffleCards(this.player2.hand);
      this.currentPlayerTurn = this.player2;
      console.log('Player 2 succesful slap!');
    }
    
    this.centralPile = [];
  }

  illegalSlap(e) {
    if (this.player1.lastAction === 'illegal' || this.player2.lastAction === 'illegal') return;
    console.log('Illegal slap!');

    if (e.key === 'f') {
      this.player2.hand.push(this.player1.hand.shift());
      this.currentPlayerTurn = this.player2;
      this.player1.lastAction = 'illegal';
    }
    
    if (e.key === 'j') {
      this.player1.hand.push(this.player2.hand.shift());
      this.currentPlayerTurn = this.player1;
      this.player2.lastAction = 'illegal';
    }
  }
}