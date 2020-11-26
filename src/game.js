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
    // determine the player that attmepted to deal
    const activePlayer = this.activePlayer(e);
    const opponent = this.playerOpponent(activePlayer);
    
    // If a player attempted to deal
    if (this.isPlayerDeal(e)) {
      this.handlePlayerDeal(activePlayer, opponent);
    }
    
    // If player attempted to slap
    if (this.isPlayerSlap(e)) {
      this.handlePlayerSlap(activePlayer, opponent);
    }
  }

  handlePlayerDeal(activePlayer, opponent) {
    // STOP player if it's not their turn OR if they have no cards
    if (!activePlayer.isPlayerTurn(this.currentPlayerTurn)) return;
    if (!activePlayer.hasCards()) return;

    // active player deals a card
    this.dealCard(activePlayer, opponent);
  }

  dealCard(activePlayer, opponent) {
    // Deal a card and add it to central pile.
    this.centralPile.unshift(activePlayer.playCard());
    console.log(this.centralPile[0].value);

    this.UpdateCurrentPlayerTurn(activePlayer, opponent);
  }
  
  UpdateCurrentPlayerTurn(activePlayer, opponent) {
    // If opponent is out of cards, player reclaims turn. OTHERWISE player turn switches to opponent.
    if (!opponent.hasCards()) return;
    this.switchPlayerTurn(activePlayer);
  }

  handlePlayerSlap(activePlayer, opponent) {
    // Slapping not allowed immediately after a player claims the central pile. Must be a deal.
    if (!this.centralPile.length) return;
    
    // TODO: HOW TO PREVENT MULTIPLE SLAPS BACK TO BACK?

    if (this.isIllegalSlap()) {
      this.handleIllegalSlap(activePlayer, opponent);
      return;
    }

    this.handleLegalSlap(activePlayer, opponent);

    //   if (this.isLegalSlap()) {
    //     activePlayer.hand = this.player1.hand.concat(this.centralPile);
    //     this.player1.hand = this.shuffleCards(this.player1.hand);
    //     this.currentPlayerTurn = this.player1;
    //     console.log('Player 1 succesful slap!');
    //   }      
    // }
  }

  handleLegalSlap(activePlayer, opponent) {
    console.log('Legal slap!');
  }

  handleIllegalSlap(activePlayer, opponent) {
    console.log('Illegal slap!');
    
    if (!activePlayer.hasCards()) {
      console.log(`Game over ${activePlayer.name} loses!`);
      return;
    }
    
    this.transferCardToOpponent(activePlayer, opponent);
  }

  isIllegalSlap() {
    return !this.isJack() && !this.isDouble() && !this.isSandwich();
  }

  isLegalSlap() {
    return this.isJack() || this.isDouble() || this.isSandwich();
  }

  transferCardToOpponent(activePlayer, opponent) {
    opponent.hand.push(activePlayer.hand.shift());
    this.UpdateCurrentPlayerTurn(activePlayer, opponent);
    // this.player1.lastAction = 'illegal';
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

  isPlayerDeal(e) {
    return (e.key === 'q' || e.key === 'p');
  }

  isPlayerSlap(e) {
    return (e.key === 'f' || e.key === 'j');
  }

  playerOpponent(player) {
    return player === this.player1 ? this.player2 : this.player1;
  }

  activePlayer(e) {
    if (e.key === 'q' || e.key === 'f') return this.player1;
    if (e.key === 'p' || e.key === 'j') return this.player2;
  }

  switchPlayerTurn(player) {
    this.currentPlayerTurn = (player === this.player1 ? this.player2 : this.player1);
  }
}