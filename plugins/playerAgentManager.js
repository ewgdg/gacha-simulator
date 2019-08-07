import * as Comlink from 'comlink'

export default async (context, inject) => {
  let playerAgentManager
  if (process.client) {
    const PlayerAgentManagerWorker = Comlink.wrap(
      new Worker('~/app/managers/PlayerAgentManager.js', { type: 'module' })
    )

    let serializable = null
    const key = 'gacha-simulator:agentState'
    const rawData = sessionStorage.getItem(key)
    const savedState =
      rawData && rawData !== 'undefined' ? JSON.parse(rawData) : undefined
    if (savedState && typeof savedState === 'object') {
      serializable = savedState
    }
    playerAgentManager = await new PlayerAgentManagerWorker()
    if (serializable) {
      await playerAgentManager.restore(serializable)
    } else {
      await playerAgentManager.setCards(
        context.store.state.modules.cards.card_info
      )
    }
    const store = context.store
    playerAgentManager.setStore(Comlink.proxy(store))
    window.onNuxtReady(() => {
      // this store restoration should be async after nuxt is ready
      // otherwise this might be conflict with store's init data action
      let promise = Promise.resolve()
      if (store.gameStatus) {
        promise = playerAgentManager.getAgentsInfo().then((info) => [
          store.commit('modules/playerAgents/mutate', {
            path: 'agents',
            with: info
          })
        ])
      }
      context.store.subscribe(async (mutation) => {
        if (mutation.type === 'persistData') {
          window.sessionStorage.setItem(
            key,
            JSON.stringify(await playerAgentManager.toSerializable())
          )
        }
      })
      return promise
    })
  }
  // the injection must be synchronously so that the plugin can get injected into Vue instance before vue instance is created
  inject('playerAgentManager', playerAgentManager)
}
