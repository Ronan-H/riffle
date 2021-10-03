
export const BaseHandScores = [
    0, // rank 0 - N/a
    0, // rank 1 - High card
    1, // rank 2 - One pair
    3, // rank 3 - Two pair
    5, // rank 4 - Three of a kind
    10, // rank 5 - Straight
    12, // rank 6 - Flush
    15, // rank 7 - Full house
    25, // rank 8 - Four of a kind
    100, // rank 9 - Straight flush
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