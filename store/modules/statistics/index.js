import Vue from 'vue'
const getDefaultState = () => {
  return {
    // prob over 100
    probabilities: {
      6: 0,
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    revenue: {},
    playerSpending: {},
    day: 0,
    secretUnlocked: false,
    rarity_counter: {
      6: 0,
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    total_count: 0,
    daily_count: 0,
    correctionFactor: 1
  }
}
export const state = getDefaultState

export const mutations = {
  unlockSecret(state) {
    state.secretUnlocked = true
  },
  increaseDay(state) {
    state.day++
    state.daily_count = 0
    state.secretUnlocked = false
  },
  add_rarity_count(state, rarity) {
    rarity = parseInt(rarity)
    state.rarity_counter[rarity]++
    state.total_count++
    state.daily_count++
  },
  update_prob(state) {
    for (const rarity of Object.keys(state.rarity_counter)) {
      if (state.total_count !== 0) {
        state.probabilities[rarity] =
          (state.rarity_counter[rarity] * 100) / state.total_count
      }
    }
  },
  setCorrectionFactor(state, payload) {
    state.correctionFactor = payload
  },
  setRevenue(state, payload) {
    state.revenue[payload.day] = payload.amount
  },
  setPlayerSpending(state, payload) {
    // state.playerSpending[payload.day] = payload.amount
    // to allow vue to be reactive
    Vue.set(state.playerSpending, payload.day, payload.amount)
  },
  reset(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState)
  }
}

export const actions = {
  updateData(context) {
    context.commit('update_prob')
    context.dispatch('updateCorrectionFactor')
  },
  updateCorrectionFactor(context) {
    if (
      context.state.total_count <
      Object.keys(context.rootState.modules.playerAgents.agents).length * 10
    ) {
      return
    }
    const state = context.state
    const target = context.rootState.modules.cards.probabilities[6]
    const cur = state.probabilities[6]
    let res = (target - cur) / cur // (state.total_count / state.daily_count)*
    res = res + 1
    res = Math.max(state.correctionFactor * 0.5, res)
    res = Math.min(state.correctionFactor * 2, res)
    if (!Number.isFinite(res) || isNaN(res)) {
      res = 1
    }
    // console.log(
    //   'correction Factor : ' + state.daily_count + ':' + cur + ':' + state.day
    // )
    context.commit('setCorrectionFactor', res)
  },
  addRevenue(context, payload) {
    const old = context.state.revenue[context.state.day]
    let amount = payload
    if (old) {
      amount += old
    }
    // console.log('addRev' + amount)
    context.commit('setRevenue', { day: context.state.day, amount: amount })
  },
  addPlayerSpending(context, payload) {
    const old = context.state.playerSpending[context.state.day]
    let amount = payload
    if (old) {
      amount += old
    }
    // console.log('addRev' + amount)
    context.commit('setPlayerSpending', {
      day: context.state.day,
      amount: amount
    })
  }
}

export const getters = {
  getCorrectionFactor(state, getters, rootState) {
    return state.correctionFactor
  }
}
