export const state = () => {
  return {
    // prob over 100
    probabilities: {},
    revenue: {},
    day: 1,
    rarity_counter: {
      6: 0,
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    total_count: 0,
    daily_count: 0
  }
}

export const mutations = {
  increaseDay(state) {
    state.day++
    state.daily_count = 0
  },
  add_rarity_count(state, rarity) {
    rarity = parseInt(rarity)
    state.rarity_counter[rarity]++
    state.total_count++
    state.daily_count++
  },
  update_prob(state) {
    for (const rarity of Object.keys(state.rarity_counter)) {
      state.probabilities[rarity] =
        (state.rarity_counter[rarity] * 100) / state.total_count
    }
  }
}

export const actions = {
  update(context) {
    context.commit('increaseDay')
    context.commit('update_prob')
  }
}

export const getters = {
  getCorrectionFactor(state, getters, rootState) {
    const target = rootState.modules.cards.probabilities[6]
    const cur = state.probabilities[6]
    let res =
      ((state.total_count / state.daily_count) * (target - cur)) / target
    if (!Number.isFinite(res) || isNaN(res)) {
      res = 1
    }
    return res
  }
}
