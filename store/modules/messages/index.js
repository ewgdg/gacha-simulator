import { shuffle } from '~/utilities/shuffle'
export const state = () => {
  return {
    messageQueue: [],
    messageWindow: [],
    pause: false
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
    if (state.pause) {
      return
    }
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
  },
  pause(state) {
    state.pause = true
  },
  resume(state) {
    state.pause = false
  }
}

export const actions = {
  addMessage(context, payload) {
    const message = payload.name + ' : ' + payload.message
    if (payload.name === 'player1') {
      context.commit('pushMessage', message)
      return
    }
    init(context)
    context.commit('addMessageToQueue', message)
  },
  resume_and_init(context) {
    context.commit('resume')
    init(context)
  }
}

function init(context) {
  if (intervalCopy !== null || context.state.pause) {
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
export const getters = {
  getMessages(state) {
    return state.messageWindow
  }
}
