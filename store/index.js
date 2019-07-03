export const state = () => {
  return {
    test: 1
  }
}

export const actions = {
  nuxtServerInit(context) {
    context.dispatch('modules/cards/assignWeights')
    context.dispatch('modules/players/initData')
  }
}
