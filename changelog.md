# Riffle Changelog

### 1.0.0 (2021-08-02)
- Added versioning.

### 1.1.0 (2021-09-20)
- Updated the scoring system to use more sensible values.
- Implemented a round limit.
  - Default: 15 rounds, as of this version.
- Added game configuration options to the pregame lobby.
  - Just the round limit for now, more options to be added later.
- Added room details to the Showdown screen, so that players can easily join ongoing games.
- Added a link to this changelog to the Lobby screen.

### 1.1.1 (2021-09-20)
- Fixed an issue where the next round/return to lobby button overlapped with the rest of the page content on smaller screens (#28).

### 1.1.2 (2021-09-26)
- Fixed an issue causing the round timer to jump around in some cases.
- Added loading spinners to the lobby, during create/join game.
- Added tutorial button/modal to the swapping screen.
- Minor style changes.
- Stability/consistency improvements.

### 1.2.0 (2021-10-03)
- Added unique colours for each player:
  - Each players name is stylized with their assigned random colour.
  - Selected card outlines are visible to all players, using each player's respective colour.
- Points are now awarded for all players, based on their hand, with a bonus multiplier for the winner of the round.
- Added separate hand ranking and leaderboard tables to the showdown screen.
  - This allows players to be ranked both according to their hand for the current round, and their score for the game as a whole.
- Style tweaks & improvements to the showdown screen.
