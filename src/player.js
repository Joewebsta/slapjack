class Player {
  
  constructor(name) {
    this.name = name;
    this.id = Date.now();
    this.wins = 0;
    this.hand = [];
    this.lastAction = '';
  }

  playCard() {
    return this.hand.shift();
  }

  saveWinsToStorage() {

  }
}