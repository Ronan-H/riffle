
export const BaseHandScores = [
    0, // rank 0 - N/a
    0, // rank 1 - High card
    5, // rank 2 - One pair
    20, // rank 3 - Two pair
    50, // rank 4 - Three of a kind
    250, // rank 5 - Straight
    300, // rank 6 - Flush
    700, // rank 7 - Full house
    2500, // rank 8 - Four of a kind
    50000, // rank 9 - Straight flush
]

// Hand probabilities
// Based on: https://en.wikipedia.org/wiki/Poker_probability

// rank 1 - High card: 0.995
// rank 2 - One pair: 1.366
// rank 3 - Two pair: 20
// rank 4 - Three of a kind: 46.33
// rank 5 - Straight: 253.8
// rank 6 - Flush: 508.8
// rank 7 - Full house: 693.17
// rank 8 - Four of a kind: 4165
// rank 9 - Straight flush: 72192