export const state = () => {
  return {
    messageQueue: [],
    messageWindow: [],
    interval: null
  }
}

export const mutations = {
  cleanMessage(state) {
    state.messageQueue.splice(0)
    state.messageWindow.splice(0)
    clearInterval(state.interval)
    state.interval = null
  },
  addMessageToQueue(state, message) {
    state.messageQueue.push(message)
  },
  readMessageToWindow(state) {
    const message = state.messageQueue.shift()
    if (message) {
      state.messageWindow.push(message)
    }
    if (state.messageQueue.length === 0 || !message) {
      clearInterval(state.interval)
      state.interval = null
    }
  },
  addInterval(state, payload) {
    state.interval = payload
  },
  pushMessage(state, message) {
    state.messageWindow.push(message)
  }
}

export const actions = {
  addMessage(context, payload) {
    const message = payload.name + ' : ' + payload.message
    if (payload.name === 'player1') {
      context.commit('pushMessage', message)
      return
    }
    if (context.state.interval === null) {
      context.dispatch('init')
    }
    context.commit('addMessageToQueue', message)
  },
  init(context) {
    const interval = setInterval(() => {
      context.commit('readMessageToWindow')
    }, 500)
    context.commit('addInterval', interval)
  }
}

export const getters = {
  getMessages(state) {
    return state.messageWindow
  }
}
