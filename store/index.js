export const state = () => {
  return {
    gameStart: true
  }
}
export const actions = {
  nuxtServerInit(context) {
    context.dispatch('modules/cards/assignWeights')
    context.dispatch('modules/players/initData')
    context.dispatch('modules/playerAgents/addAgent', 'player1')
    initAgents(context)
  },
  nextDay(context) {
    context.dispatch('modules/playerAgents/updateDay')
    context.dispatch('modules/statistics/update')
    context.dispatch('modules/playerAgents/updateWeights')
    context.commit('modules/lootboxResult/reset')
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
