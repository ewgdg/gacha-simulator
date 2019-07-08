export const state = () => {
  return {
    test: 1
  }
}
export const actions = {
  nuxtServerInit(context) {
    context.dispatch('modules/cards/assignWeights')
    context.dispatch('modules/players/initData')
    context.dispatch('modules/playerAgents/addAgent', 'player1')
    initAgents(context)
  }
}

const initAgents = (context) => {
  for (let i = 0; i < 10; i++) {
    context.dispatch('modules/playerAgents/addAgent')
  }
}
