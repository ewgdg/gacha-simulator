export default {
  initData: function(context) {
    const cards = context.rootGetters['modules/cards/getCards']
    const list = Object.keys(cards)
    for (const card of list) {
      context.commit('resetCard', card)
    }
  },
  addCard(context, payload) {
    context.commit('addCard', payload)
  }
}
