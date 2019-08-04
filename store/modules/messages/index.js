import { shuffle } from '~/utilities/shuffle'
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
  },
  shuffle(state) {
    shuffle(state.messageQueue)
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
      intervalCopy = setInterval(() => {
        context.commit('readMessageToWindow')
        if (intervalCopy === null) {
          context.commit('persistGameState', null, { root: true })
        }
      }, 500)
    }
  }
}

export const getters = {
  getMessages(state) {
    return state.messageWindow
  }
}
