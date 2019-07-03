export default {
  addCard(state, payload) {
    state.players.player1.cards[payload].count += 1
  },
  resetCard(state, payload) {
    state.players.player1.cards[payload] = { count: 0 }
  }
}
