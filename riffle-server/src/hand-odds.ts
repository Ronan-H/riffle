
/**
 * Taken from: https://en.wikipedia.org/wiki/Poker_probability
 */
export const HandOdds = [
    0, // rank 0 - N/a
    0.995, // rank 1 - High card
    1.366, // rank 2 - One pair
    20.0, // rank 3 - Two pair
    46.33, // rank 4 - Three of a kind
    253.8, // rank 5 - Straight
    508.8, // rank 6 - Flush
    693.17, // rank 7 - Full house
    4165, // rank 8 - Four of a kind
    72192, // rank 9 - Straight flush
]