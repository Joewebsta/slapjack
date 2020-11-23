class Game {

  constructor(cards) {
    this.cards = cards;
    
    console.log('Game created!')
    // 2 players
    // Afray of all possible cards?
    // Central pile of cards
    // Player's whose current turn it is
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