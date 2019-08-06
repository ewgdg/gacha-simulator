import PlayerAgentManager from '~/app/managers/PlayerAgentManager'
export default (context, inject) => {
  let playerAgentManager
  if (process.client) {
    const store = context.store
    const key = 'gacha-simulator:agentState'
    const rawData = sessionStorage.getItem(key)
    const savedState =
      rawData && rawData !== 'undefined' ? JSON.parse(rawData) : undefined

    if (typeof savedState === 'object' && savedState) {
      playerAgentManager = PlayerAgentManager.reconstruct(savedState, store)
    } else {
      playerAgentManager = new PlayerAgentManager(
        context.store.state.modules.cards.card_info,
        context.store
      )
    }
    window.onNuxtReady(() => {
      // this store restoration should be async after nuxt is ready
      // otherwise this might be conflict with store's init data action
      if (store.gameStatus) {
        store.commit('modules/playerAgents/mutate', {
          path: 'agents',
          with: playerAgentManager.getAgentsInfo()
        })
      }

      context.store.subscribe((mutation) => {
        if (mutation.type === 'persistData') {
          window.sessionStorage.setItem(
            key,
            JSON.stringify(playerAgentManager.toSerializable())
          )
          // const payload = mutation.payload
          // if (payload && payload.path) {
          //   const path = Array.isArray(payload.path)
          //     ? payload.path
          //     : payload.path.split('.')
          //   if (path.length > 0 && path[0] === 'agents') {
          //     window.sessionStorage.setItem(
          //       key,
          //       JSON.stringify(playerAgentManager.toSerializable())
          //     )
          //   }
          // }
        }
      })
    })
  } else {
    playerAgentManager = new PlayerAgentManager(
      context.store.state.modules.cards.card_info,
      context.store
    )
  }
  // the injection must be synchronously so that the plugin can get injected into Vue instance before vue instance is created
  inject('playerAgentManager', playerAgentManager)
}
