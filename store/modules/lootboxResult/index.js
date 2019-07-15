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
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }
export const actions = {
  nextDraw(context) {
    // const cardInfo = context.rootState.modules.cards.card_info
    // const keys = Object.keys(cardInfo)
    // const values = Object.values(cardInfo)
    // const res = keys[weightedRandom(values)]
    // eslint-disable-next-line
    // console.log(keys)
    const res = context.rootGetters['modules/playerAgents/getNextDraw'](
      'player1'
    )

    // eslint-disable-next-line
    // console.log(res)
    const id = context.getters.getId
    context.commit('push', { name: res, key: id })
    context.commit('increase_id')
    context.dispatch(
      'modules/playerAgents/addCard',
      { name: 'player1', card: res },
      { root: true }
    )
  },
  generateResult(context, payload) {
    const commit = context.commit
    const dispatch = context.dispatch
    commit('reset')
    commit('modules/playerAgents/increaseDrawFrequency', 'player1', {
      root: true
    })

    for (let i = 0; i < payload; i++) {
      // await sleep(100)
      dispatch('nextDraw')
    }
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
