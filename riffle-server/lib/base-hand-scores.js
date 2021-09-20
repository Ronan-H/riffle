"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHandScores = void 0;
exports.BaseHandScores = [
    0,
    0,
    1,
    3,
    5,
    10,
    12,
    15,
    25,
    100, // rank 9 - Straight flush
];
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
