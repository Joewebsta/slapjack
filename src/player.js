class Player {
  
  constructor(name, cards) {
    this.name = name;
    this.id = Date.now();
    this.wins = +JSON.parse(localStorage.getItem('wins'))[this.name];
    this.hand = cards;
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