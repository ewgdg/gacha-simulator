export const state = () => {
  return {
    gameStart: true
  }
}
export const actions = {
  nuxtServerInit(context) {
    startGame(context)
  },
  nextDay(context) {
    context.commit('modules/messages/cleanMessage')

    // context.dispatch('modules/playerAgents/updateWeights')
    context.commit('modules/lootboxResult/reset')

    context.dispatch('modules/playerAgents/updateDayBefore')
    context.commit('modules/statistics/increaseDay')
    context.dispatch('modules/playerAgents/updateDayAfter')
    context.dispatch('modules/statistics/updateData')
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
  context.dispatch('modules/playerAgents/addAgent', 'player1')
  for (let i = 0; i < 100; i++) {
    context.dispatch('modules/playerAgents/addAgent')
  }
}

const startGame = (context) => {
  context.dispatch('modules/cards/assignWeights')
  initAgents(context)
  context.dispatch('nextDay')
  // context.commit('modules/lootboxResult/reset')
  //
  // context.dispatch('modules/playerAgents/updateDay')
  // context.dispatch('modules/statistics/updateData')
  //
  // context.commit('modules/statistics/increaseDay')
}
