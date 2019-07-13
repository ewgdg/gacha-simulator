export const state = () => {
  return {
    gameStart: true
  }
}
export const actions = {
  nuxtServerInit(context) {
    context.dispatch('modules/cards/assignWeights')
    context.dispatch('modules/playerAgents/addAgent', 'player1')
    startGame(context)
  },
  nextDay(context) {
    context.commit('modules/messages/cleanMessage')
    context.dispatch('modules/playerAgents/updateDay')
    context.dispatch('modules/statistics/updateData')

    // context.dispatch('modules/playerAgents/updateWeights')
    context.commit('modules/lootboxResult/reset')
    context.commit('modules/statistics/increaseDay')
  },
  endGame(context) {
    context.commit('endGame')
  }
}

export const mutations = {
  endGame(state) {
    state.gameStart = false
  }
}

const initAgents = (context) => {
  for (let i = 0; i < 10; i++) {
    context.dispatch('modules/playerAgents/addAgent')
  }
}

const startGame = (context) => {
  initAgents(context)
  // context.dispatch('modules/playerAgents/updateDay')
  context.dispatch('modules/statistics/updateData')
  context.commit('modules/lootboxResult/reset')
}
