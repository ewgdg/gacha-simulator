export const state = () => {
  return {
    messageQueue: [
      'sss',
      'sdfsdf',
      'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
      'ddddddd',
      'sfdgff',
      'dfgdfgawsd',
      'sss',
      'sdfsdf',
      'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
      'ddddddd',
      'sfdgff',
      'dfgdfgawsd',
      'sss',
      'sdfsdf',
      'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
      'ddddddd',
      'sfdgff',
      'dfgdfgawsd'
    ],
    messageWindow: []
  }
}

export const mutations = {
  cleanMessage(state) {
    state.messageQueue.splice(0)
    state.messageWindow.splice(0)
  },
  addMessageToQueue(state, message) {
    state.messageQueue.push(message)
  },
  readMessageToWindow(state) {
    const message = state.messageQueue.shift()
    if (message) {
      state.messageWindow.push(message)
    }
  }
}

export const actions = {
  addMessage(context, payload) {
    const message = payload.name + ' : ' + payload.message
    context.commit('addMessageToQueue', message)
  },
  init(context) {
    setInterval(() => {
      context.commit('readMessageToWindow')
    }, 300)
  }
}

export const getters = {
  getMessages(state) {
    return state.messageWindow
  }
}
