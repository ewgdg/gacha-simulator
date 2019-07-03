// export const state = () => {
//   return {
//     card_info: {
//       Exusiai: {
//         rarity: 5,
//         weight: 0
//       },
//       Kroos: {
//         rarity: 3,
//         weight: 0
//       }
//     },
//     list: ['Exusiai', 'Kroos'],
//     probabilities: {
//       5: 2,
//       3: 98
//     }
//   }
// }
import { weightedRandom } from '~/utilities/random'

export const mutations = {
  mutate_card_weight(state, payload) {
    state.card_info[payload.name].weight = payload.weight
  }
}

export const actions = {
  assignWeights(context, payload) {
    const counter = {}
    for (const key in context.state.card_info) {
      const rarity = context.state.card_info[key].rarity
      if (!counter[rarity]) {
        counter[rarity] = 0
      }
      counter[rarity] += 1
    }
    for (const key in context.state.card_info) {
      const card = context.state.card_info[key]
      const rarity = card.rarity
      const weight = context.state.probabilities[rarity] / counter[rarity]
      context.commit('mutate_card_weight', { name: key, weight: weight })
    }
  },
  generateCard(context) {
    const keys = Object.keys(context.state.card_info)
    const values = Object.values(context.state.card_info)
    return new Promise((resolve) => {
      resolve(keys[weightedRandom(values)])
      // return keys[weightedRandom(values)]
    })
  }
}

export const getters = {
  getCards(state) {
    return state.card_info
  },
  getCardInfo: (state) => (name) => {
    return state.card_info[name]
  }
}
