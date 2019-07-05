export const state = () => {
  return {
    balance: 0
  }
}

export const mutations = {
  addGemstone(state, payload) {
    state.balance += parseInt(payload)
  }
}

export const getters = {
  getBalance(state) {
    return state.balance
  }
}
