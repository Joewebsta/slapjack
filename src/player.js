class Player {
  
  constructor(name, cards) {
    this.name = name;
    this.hand = cards;
    this.wins = this.retreivePlayerWins();
  }

  playCard() {
    return this.hand.shift();
  }

  isPlayerTurn(currentPlayerTurn) {
    return this === currentPlayerTurn;
  }

  hasCards() {
    return this.hand.length;
  }

  updateWins() {
    this.wins += 1;
  }
    
  saveWinsToStorage() {
    const winsObj = this.retreiveStorage();
    winsObj[this.name] = this.wins;
    localStorage.setItem('wins', JSON.stringify(winsObj));
  }
  
  retreiveStorage() {
    return JSON.parse(localStorage.getItem('wins'));
  }

  retreivePlayerWins() {
    return +this.retreiveStorage()[this.name];
  }
}
