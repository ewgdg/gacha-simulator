export const state = () => {
  return {
    gameStatus: false
  }
}
export const actions = {
  nuxtServerInit(context) {
    context.dispatch('startGame')
  },
  nextDay(context) {
    return new Promise((resolve) => {
      // to run it async , we can use setTimeout(func,0)
      this.$executeAsync(() => {
        context.commit('modules/messages/cleanMessage')

        // context.dispatch('modules/playerAgents/updateWeights')
        context.commit('modules/lootboxResult/reset')

        context.dispatch('modules/playerAgents/updateDayBefore')
        context.commit('modules/statistics/increaseDay')
        context.dispatch('modules/playerAgents/updateDayAfter')
        context.dispatch('modules/statistics/updateData')
        resolve()
      })
    })
  },
  endGame(context) {
    context.commit('modules/lootboxResult/reset')
    context.commit('modules/messages/cleanMessage')
    context.commit('setGameStatus', false)
  },
  startGame(context) {
    context.commit('modules/playerAgents/reset')
    context.commit('modules/statistics/reset')
    context.dispatch('modules/cards/assignWeights')
    initAgents(context)
    context.dispatch('nextDay')
    context.commit('setGameStatus', true)
  }
}

export const mutations = {
  setGameStatus(state, payload) {
    state.gameStatus = payload
  }
}

const initAgents = (context) => {
  context.dispatch('modules/playerAgents/addAgent', 'player1')
  for (let i = 0; i < 10; i++) {
    context.dispatch('modules/playerAgents/addAgent')
  }
}

// const startGame = (context) => {
//   context.dispatch('modules/playerAgents/reset')
//   context.dispatch('modules/statistics/reset')
//   context.dispatch('modules/cards/assignWeights')
//   initAgents(context)
//   context.dispatch('nextDay')
//   // context.commit('modules/lootboxResult/reset')
//   //
//   // context.dispatch('modules/playerAgents/updateDay')
//   // context.dispatch('modules/statistics/updateData')
//   //
//   // context.commit('modules/statistics/increaseDay')
// }
