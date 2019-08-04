export const state = () => {
  return {
    messageQueue: [],
    messageWindow: []
  }
}

let intervalCopy = null
export const mutations = {
  cleanMessage(state) {
    clearInterval(intervalCopy)
    intervalCopy = null
    state.messageQueue.splice(0)
    state.messageWindow.splice(0)
  },
  addMessageToQueue(state, message) {
    state.messageQueue.push(message)
  },
  readMessageToWindow(state) {
    // console.log('read')
    const message = state.messageQueue.shift()
    if (message) {
      state.messageWindow.push(message)
    }
    if (state.messageQueue.length === 0 || !message) {
      clearInterval(intervalCopy)
      intervalCopy = null
    }
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
    if (intervalCopy === null) {
      context.dispatch('init')
    }
    context.commit('addMessageToQueue', message)
  },
  init(context) {
    if (intervalCopy !== null) {
      return
    }
    // this has to be called in client side
    if (process.client) {
      clearInterval(intervalCopy)
      const interval = setInterval(() => {
        context.commit('readMessageToWindow')
      }, 500)
      intervalCopy = interval
    }
  }
}

export const getters = {
  getMessages(state) {
    return state.messageWindow
  }
}
