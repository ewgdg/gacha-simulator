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
  updateAgentsInfo(context) {
    context.commit('mutate', {
      path: 'agents',
      with: this.$playerAgentManager.getAgentsInfo()
    })
  },
  updateAgentInfo(context, name) {
    context.commit('mutate', {
      path: ['agents', name],
      with: this.$playerAgentManager.agents.get(name).getInfo()
    })
  },
  agentTopup(context, payload) {
    const agent = this.$playerAgentManager.agents.get(payload.name)
    const actual_amount = agent.topup(payload.amount)

    context.dispatch('modules/statistics/addRevenue', actual_amount, {
      root: true
    })
    if (payload.name === 'player1') {
      context.dispatch('modules/statistics/addPlayerSpending', actual_amount, {
        root: true
      })
    }
    context.dispatch('updateAgentInfo', payload.name)
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
  }
}
