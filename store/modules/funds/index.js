export const state = () => {
  return {
    gemstone: 0
  }
}

export const mutations = {
  addGemstone(state, payload) {
    state.gemstone += payload
  }
}

export const getters = {
  getBalance(state) {
    return state.gemstone
  }
}
