import Vue from 'vue'
import { eventBus } from '~/plugins/eventBus'
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
    correctionFactor: 1,
    correctionFactor2: 1
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
  setCorrectionFactor2(state, payload) {
    state.correctionFactor2 = payload
  },
  setRevenue(state, payload) {
    Vue.set(state.revenue, payload.day, payload.amount)
  },
  setPlayerSpending(state, payload) {
    // state.playerSpending[payload.day] = payload.amount
    // to allow vue to be reactive
    Vue.set(state.playerSpending, payload.day, payload.amount)
  },
  reset(state) {
    // Merge rather than replace so we don't lose observers
    Object.assign(state, getDefaultState())
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
      Math.max(
        500,
        Object.keys(context.rootState.modules.playerAgents.agents).length * 10
      )
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

    const target2 = context.rootState.modules.cards.probabilities[5]
    const cur2 = state.probabilities[5]
    let res2 = (target2 - cur2) / cur2
    res2 = res2 + 1
    res2 = Math.max(state.correctionFactor2 * 0.5, res2)
    res2 = Math.min(state.correctionFactor2 * 2, res2)
    if (!Number.isFinite(res2) || isNaN(res2)) {
      res2 = 1
    }

    context.commit('setCorrectionFactor', res)
    context.commit('setCorrectionFactor2', res2)
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
  },
  checkStatistics(context) {
    context.commit('update_prob')
    // if the stat does not match with the announced odds, the company will perform a flash maintenance and issue a hotfix.
    // as a result player will get compensate for the server maintenance time which is proportional the diff between expected mean and the actual population mean.
    if (
      context.state.day > 0 &&
      context.state.day % 7 === 0 &&
      context.state.day < 30
    ) {
      const diff = Math.abs(context.state.probabilities[6] - 2)
      const compensation = Number.parseInt((diff / 2) * 6000)

      if (!isNaN(compensation) && compensation > 0) {
        context.dispatch('modules/playerAgents/addCompensation', compensation, {
          root: true
        })
        eventBus.$emit(
          'message',
          `Deer player, you are compensated with ${compensation} gemstones due to the server maintenance`
        )
      }
    }
  }
}

export const getters = {
  getCorrectionFactor(state, getters, rootState) {
    return state.correctionFactor
  },
  getCorrectionFactor2(state, getters, rootState) {
    return state.correctionFactor2
  }
}
