import { ArraySchema } from '@colyseus/schema';

export function shuffleInPlace(cards: ArraySchema<any> | Array<any>) {
  // Fisher–Yates shuffle -- https://bost.ocks.org/mike/shuffle/
  let m = cards.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = cards[m];
    cards[m] = cards[i];
    cards[i] = t;
  }

  return cards;
}
