import Vue from 'vue'
// import { nextDecimal } from '~/utilities/random'

export const state = () => {
  return {
    gameStatus: false,
    agentNumber: 50,
    progress: 0,
    maxProgressValue: 50
  }
}
export const actions = {
  nuxtServerInit(context) {
    // context.dispatch('startGame')
    context.dispatch('modules/cards/assignWeights')
  },
  nextDay(context) {
    return new Promise(async (resolve) => {
      context.commit('modules/messages/cleanMessage')

      // context.dispatch('modules/playerAgents/updateWeights')
      context.commit('modules/lootboxResult/reset')

      context.dispatch('modules/playerAgents/updateDayBefore')
      context.commit('modules/statistics/increaseDay')
      await context.dispatch('modules/playerAgents/updateDayAfter')
      context.dispatch('modules/statistics/updateData')
      resolve()
    })
  },
  endGame(context) {
    context.commit('modules/lootboxResult/reset')
    context.commit('modules/messages/cleanMessage')
    context.commit('modules/statistics/reset')
    context.commit('setGameStatus', false)
    context.commit('resetProgress')
  },
  startGame(context) {
    context.commit('modules/playerAgents/reset')
    context.commit('modules/statistics/reset')
    context.dispatch('modules/playerAgents/addAgent', 'player1')
    initAgents(context)
    context.dispatch('nextDay').then(async () => {
      await this.$waitForAnimation()
      await this.$wait(777)
      context.commit('setGameStatus', true)
    })
  },
  async progressing(context, payload) {
    const max = context.state.maxProgressValue
    const current = context.state.progress
    if (current < max) {
      context.commit('increaseProgress', Math.min(payload, max - current))
    }
    // await this.$wait(25)
    // const percentage = parseInt((current / max) * 100)
    await Vue.nextTick()
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve)
      })
    })
  }
}

export const mutations = {
  setGameStatus(state, payload) {
    state.gameStatus = payload
  },
  increaseProgress(state, payload) {
    state.progress += payload
    // console.log(state.progress)
  },
  resetProgress(state) {
    state.progress = 0
  }
}

const initAgents = (context) => {
  for (let i = 0; i < context.state.agentNumber; i++) {
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
