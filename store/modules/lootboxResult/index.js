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
    state.id++
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
  async generateResult(context, payload) {
    const commit = context.commit
    const agent = await this.$playerAgentManager.getAgent('player1')

    const res = await agent.drawCards(payload)

    const card_info = context.rootState.modules.cards.card_info
    const name = await agent.getName()
    for (const card of res) {
      const rarity = card_info[card].rarity
      context.commit('modules/statistics/add_rarity_count', rarity, {
        root: true
      })
      if (rarity >= 5) {
        context.dispatch(
          'modules/messages/addMessage',
          {
            name: name,
            message: `${name} just got a card '${card}' of rarity ${rarity}`
          },
          { root: true }
        )
      }
    }
    commit('set_list', res)

    await context.dispatch('modules/playerAgents/updateAgentInfo', 'player1', {
      root: true
    })
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
