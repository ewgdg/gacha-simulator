import Vue from 'vue'
const getDefaultState = () => {
  return {
    agents: {},
    playerRank: 0
  }
}
export const state = getDefaultState
export const mutations = {
  mutate(state, payload, addObserver = false) {
    const properties = Array.isArray(payload.path)
      ? payload.path
      : payload.path.split('.')
    const obj = properties
      .slice(0, -1)
      .reduce((prev, cur) => prev && prev[cur], state)

    const property = properties[properties.length - 1]
    if (addObserver) {
      Vue.set(obj, property, payload.with)
    } else {
      obj[property] = payload.with
    }
  },
  reset(state) {
    Object.assign(state, getDefaultState())
  }
}

export const actions = {
  async updateAgentsInfo(context) {
    context.commit('mutate', {
      path: 'agents',
      with: await this.$playerAgentManager.getAgentsInfo()
    })
  },
  async updateAgentInfo(context, name) {
    const agent = await this.$playerAgentManager.getAgent(name)
    context.commit('mutate', {
      path: ['agents', name],
      with: await agent.getInfo()
    })
  },
  async agentTopup(context, payload) {
    const agent = await this.$playerAgentManager.getAgent(payload.name)
    const actual_amount = await agent.topup(payload.amount)

    context.dispatch('modules/statistics/addRevenue', actual_amount, {
      root: true
    })
    if (payload.name === 'player1') {
      context.dispatch('modules/statistics/addPlayerSpending', actual_amount, {
        root: true
      })
    }
    await context.dispatch('updateAgentInfo', payload.name)
  }
}

export const getters = {
  getBalance(state) {
    return (name = 'player1') => {
      let agent
      if ((agent = state.agents[name])) {
        return agent.balance
      }
      return undefined
    }
  },
  getAgent: (state) => (name) => {
    if (!name) {
      name = 'player1'
    }
    const agent = state.agents[name]
    return agent
  },
  getCards: (state, getters) => (name) => {
    const agent = getters.getAgent(name)
    if (!agent) {
      return {}
    }
    return agent.card_counter
  },
  getRarityCounter: (state, getters, rootState, rootGetters) => (name) => {
    // get rarity count
    const cards = getters.getCards(name)
    const card_info = rootState.modules.cards.card_info

    const res = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    for (const card of Object.keys(cards)) {
      const count = cards[card]
      const rarity = card_info[card].rarity
      res[rarity] += count
    }
    return res
  },
  getPlayerRarityCounter: (state, getters) => {
    return getters.getRarityCounter('player1')
  },
  getPlayerTotalCardCount(state, getters) {
    const counter = getters.getPlayerRarityCounter
    let total_count = 0
    for (const rarity of Object.keys(counter)) {
      total_count += counter[rarity]
    }
    return total_count
  },
  getPlayerRarityProportion(state, getters) {
    const res = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    const counter = getters.getPlayerRarityCounter
    const total_count = getters.getPlayerTotalCardCount
    if (total_count !== 0) {
      for (const rarity of Object.keys(counter)) {
        res[rarity] = (counter[rarity] * 100) / total_count
      }
    }
    return res
  }
}
