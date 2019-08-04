import Vue from 'vue'
// import { nextDecimal } from '~/utilities/random'
// disable strict mode for vuex-persistedState
export const strict = false
export const state = () => {
  return {
    gameStatus: false,
    difficulty: 'difficult',
    agentNumber: 0,
    progress: 0,
    maxProgressValue: 0,
    user: null,
    userHistory: [],
    globalRankTable: [],
    agentComposition: {}
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

      context.commit('modules/lootboxResult/reset')
      // detect abnormal data
      context.dispatch('modules/statistics/checkStatistics')
      context.dispatch('modules/statistics/updateData')
      this.$playerAgentManager.updateDayBefore()
      // context.dispatch('modules/playerAgents/updateDayBefore')
      context.commit('modules/statistics/increaseDay')
      await this.$playerAgentManager.updateDayAfter()
      context.commit('modules/messages/shuffle')
      // await context.dispatch('modules/playerAgents/updateDayAfter')
      context.dispatch('modules/playerAgents/updateAgentsInfo')
      context.commit('persistData')
      resolve()
    })
  },
  endGame(context) {
    context.commit('modules/statistics/update_prob')
    this.$playerAgentManager.updateScores()
    context.dispatch('modules/playerAgents/updateAgentsInfo')

    context.commit('modules/lootboxResult/reset')
    context.commit('modules/messages/cleanMessage')
    // context.commit('modules/statistics/reset')
    context.commit('setGameStatus', false)
    context.commit('resetProgress')
    this.$playerAgentManager.reset()
    context.commit('persistData')
  },
  async startGame(context, difficulty) {
    if (difficulty) {
      context.commit('setDifficulty', difficulty)
    }

    context.commit('modules/playerAgents/reset')
    context.commit('modules/statistics/reset')

    // init game params
    difficulty = context.state.difficulty
    let agentNumber, agentComposition
    if (difficulty === 'easy') {
      agentNumber = process.env.NODE_ENV === 'development' ? 10 : 100
      agentComposition = { 'free rider': 0.1, chive: 0.5, multi: 0.4 }
    } else {
      agentNumber = process.env.NODE_ENV === 'development' ? 10 : 500
      agentComposition = { 'free rider': 0.79, chive: 0.2, multi: 0.01 }
    }
    context.commit('setAgentNumber', agentNumber)
    context.commit('setAgentComposition', agentComposition)
    context.commit('setMaxProgressValue', context.state.agentNumber * 1.1 + 10)

    this.$playerAgentManager.reset()
    this.$playerAgentManager.addAgent('player1', 'player')

    context.dispatch('modules/cards/loadImages')

    const initFunc = initAgents.bind(this)
    await initFunc(context)

    await context.dispatch('nextDay')
    await this.$waitForAnimation()
    await this.$wait(777)
    context.commit('setGameStatus', true)
    context.commit('persistData')
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
  },
  clearSession(context) {
    context.commit('modules/playerAgents/reset')
    context.commit('modules/statistics/reset')
    context.commit('setGameStatus', false)
    context.commit('resetProgress')
    this.$playerAgentManager.reset()
    window.sessionStorage.removeItem('gacha-simulator')
    window.sessionStorage.removeItem('gacha-simulator:agentState')
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
  },
  setUser(state, user) {
    state.user = user
  },
  setAgentComposition(state, payload) {
    state.agentComposition = payload
  },
  setMaxProgressValue(state, payload) {
    state.maxProgressValue = payload
  },
  setAgentNumber(state, payload) {
    state.agentNumber = payload
  },
  setGlobalRankTable(state, paylaod) {
    state.globalRankTable = paylaod
  },
  setUserHistory(state, paylaod) {
    state.userHistory = paylaod
  },
  setDifficulty(state, payload) {
    state.difficulty = payload
  },
  persistData(state) {
    // do nothing, just to notify persist plugin to store data to storage.
  },
  persistGameState(state) {}
}

async function initAgents(context) {
  const agentComposition = context.state.agentComposition
  let start = 0
  for (const key of Object.keys(agentComposition)) {
    const ratio = agentComposition[key]
    const end = start + context.state.agentNumber * ratio
    for (let i = start; i < end; i++) {
      this.$playerAgentManager.addAgent(null, key)
      await context.dispatch('progressing', 0.1, { root: true })
    }
    start = end
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
