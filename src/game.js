class Game {

  constructor(player1, player2, cards) {
    this.player1 = player1;
    this.player2 = player2;
    this.cards = cards;
    this.centralPile = [];
    this.currentPlayerTurn = [this.player1];
    console.log('Game created!');
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
}


// Create instance of game on load
// Create array of all cards
// Shuffle array of cards
// Create two player instances deal half of cards to Player constructor as arguments
// Player deals card to central pile
// Player slaps card

// SHUFFLE ARRAY
// Use Math.random to select random index between zero and (length - 1)
// Add index to new array and remove index from original array
// Continue until orginal array length is zero.