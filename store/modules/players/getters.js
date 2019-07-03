export default {
  getPlayer(state) {
    return state.players.player1
  },
  getCards(state, getters) {
    return getters.getPlayer.cards
  }
}
