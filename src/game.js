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
    // if (e.key === 'q' || e.key === 'p') {
    //   this.dealCard(e);
    // }

    // console.log(this.isPlayerDeal(e));

    // If a player attempted to deal
    if (this.isPlayerDeal(e)) {
      // determine the player that attmepted to deal
      const activePlayer = this.activePlayer(e);
      
      // STOP player if it's not their turn OR if they have no cards
      if (!this.isActivePlayerTurn(activePlayer) || !this.playerHasCards(activePlayer)) return;
      
      // active player deals a card
      this.dealCard(activePlayer);
      
      // IF OPPONENT HAS NO CARDS, RECLAIM TURN
      
      // console.log(`Player deal: ${this.isPlayerDeal(e)}`);
      // console.log(`Active player: ${activePlayer.name}`);
      // console.log(`Active player turn: ${this.isActivePlayerTurn(activePlayer)}`);
      // console.log(`Active player has cards: ${this.playerHasCards(activePlayer)}`);
      // console.log('Deal a damn card already!');
    }
    
    if (e.key === 'f' || e.key === 'j') {
      this.slapCard(e);
    }
  }

  dealCard(player) {
    // Deal a card and add it to central pile. Pass turn to opponent.
    this.centralPile.unshift(player.playCard());
    this.switchPlayerTurn(player);
    console.log(this.centralPile[0].value);

    // this.player1.lastAction = 'deal';

    // // Reclaim turn if opponenet is out of cards
    // if (e.key === 'q' && !this.player2.hand.length) {
    //   this.currentPlayerTurn = this.player1;
    // }

    // if (e.key === 'p' && !this.player1.hand.length) {
    //   this.currentPlayerTurn = this.player2;
    // }
  }

  slapCard(e) {
    // Slapping not allowed immediately after a player claims the central pile. Must be a deal.
    if ((e.key === 'f' || e.key === 'j') && !this.centralPile.length) return;

    // Game should end if opponenet slaps card when player has no cards
    if (e.key === 'f' && !this.player2.hand.length && this.isJack()) {
      console.log('GAME OVER! PLAYER 2 LOSES');
      return;
    }
    
    if (e.key === 'j' && !this.player1.hand.length && this.isJack()) { // USE exit() OR labels??
      console.log('GAME OVER! PLAYER 1 LOSES');
      return;
    }

    // Player 1 out of cards, player 1 slaps incorrectly (illegal, double or sandwich) = Game over
    if (e.key === 'f' && !this.player2.hand.length && !this.isJack() && !this.isDouble() && !this.isSandwich()) {
      console.log('GAME OVER! PLAYER 2 DID NOT SLAP A JACK TO REVIVE HIMSELF');
      return;
    }

    if (e.key === 'j' && !this.player1.hand.length && !this.isJack() && !this.isDouble() && !this.isSandwich()) {
      console.log('GAME OVER! PLAYER 1 DID NOT SLAP A JACK TO REVIVE HIMSELF');
      return;
    }

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

  isPlayerDeal(e) {
    return (e.key === 'q' || e.key === 'p');
  }

  playerHasCards(player) {
    return player.hand.length;
  }

  activePlayer(e) {
    if (e.key === 'q' || e.key === 'f') return this.player1;
    if (e.key === 'p' || e.key === 'j') return this.player2;
  }

  isActivePlayerTurn(player) {
    return player === this.currentPlayerTurn;
  }

  switchPlayerTurn(player) {
    this.currentPlayerTurn = (player === this.player1 ? this.player2 : this.player1);
  }
}