import PlayerAgentManager from '~/app/managers/PlayerAgentManager'

export default (context, inject) => {
  let playerAgentManager
  if (process.client) {
    window.onNuxtReady(() => {
      const store = context.store
      const key = 'gacha-simulator:agentState'
      const rawData = sessionStorage.getItem(key)
      const savedState =
        rawData && rawData !== 'undefined' ? JSON.parse(rawData) : undefined

      if (typeof savedState === 'object' && savedState) {
        playerAgentManager = PlayerAgentManager.reconstruct(savedState, store)
        store.commit('modules/playerAgents/mutate', {
          path: 'agents',
          with: playerAgentManager.getAgentsInfo()
        })
      } else {
        playerAgentManager = new PlayerAgentManager(
          context.store.state.modules.cards.card_info,
          context.store
        )
      }
      inject('playerAgentManager', playerAgentManager)

      context.store.subscribe((mutation) => {
        if (/^modules\/playerAgents\/mutate.*$/i.test(mutation.type)) {
          const payload = mutation.payload

          if (payload && payload.path) {
            const path = Array.isArray(payload.path)
              ? payload.path
              : payload.path.split('.')
            if (path.length > 0 && path[0] === 'agents') {
              window.sessionStorage.setItem(
                key,
                JSON.stringify(playerAgentManager.toSerializable())
              )
            }
          }
        }
      })
    })
  } else {
    playerAgentManager = new PlayerAgentManager(
      context.store.state.modules.cards.card_info,
      context.store
    )
    inject('playerAgentManager', playerAgentManager)
  }
  // need to wait for the nuxt ready if this is the client side
}
