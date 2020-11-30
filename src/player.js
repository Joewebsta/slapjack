class Player {
  
  constructor(name) {
    this.name = name;
    this.id = Date.now();
    // this.wins = 0;
    this.wins = +JSON.parse(localStorage.getItem('wins'))[this.name];
    this.hand = [];
    this.lastAction = '';
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
  
  retreiveStorage() {
    return JSON.parse(localStorage.getItem('wins'));
  }

  saveWinsToStorage() {
    const winsObj = this.retreiveStorage();
    winsObj[this.name] = this.wins;
    localStorage.setItem('wins', JSON.stringify(winsObj));
  }
}