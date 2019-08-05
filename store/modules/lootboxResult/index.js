// import { weightedRandom } from '~/utilities/random'

export const state = () => {
  return {
    list: [],
    id: 0
  }
}

export const mutations = {
  reset(state) {
    state.list = []
  },
  set_list(state, payload) {
    state.list = payload
  },
  push(state, payload) {
    state.list.push(payload)
  },
  increase_id(state) {
    state.id++
  }
}
export const actions = {
  generateResult(context, payload) {
    const commit = context.commit
    commit('reset')
    const agent = this.$playerAgentManager.agents.get('player1')
    // debugger
    const res = agent.drawCards(payload)
    // debugger
    this.$playerAgentManager.recordCardsFootprintToStore(res, agent)
    context.commit('set_list', res)
    context.dispatch('modules/playerAgents/updateAgentInfo', 'player1', {
      root: true
    })
    commit('increase_id')
    context.commit('persistData', null, { root: true })
  }
}

export const getters = {
  getResults(state) {
    return state.list
  },
  getId(state) {
    return state.id
  }
}
