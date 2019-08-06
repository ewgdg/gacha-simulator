// import AgentManagerWorker from '~/workers/AgentManagerWorker.workertest.js'
// import AgentManagerWorker from '~/workers/test.worker.js'
// import QueryableWorker from '~/utilities/QueryableWorker'
import * as Comlink from 'comlink'
// import PlayerAgentManager from '~/app/managers/PlayerAgentManager'
// class PlayerAgentManagerWrapper {
//   constructor(cards) {
//     this.queryableWorker = null
//     if (process.client) {
//       this.queryableWorker = new QueryableWorker(new AgentManagerWorker())
//       this.setCards(cards)
//     }
//   }
//   setCards(cards) {
//     this.queryableWorker.sendQuery('setCards', cards)
//   }
//
//   getAgentsInfo() {
//     return this.queryableWorker.sendQuerySync('getAgentsInfo')
//   }
//   toSerializable() {
//     return this.queryableWorker.sendQuerySync('toSerializable')
//   }
//   reset() {
//     this.queryableWorker.sendQuery('reset')
//   }
//   addAgent(name) {
//     this.queryableWorker.sendQuery('addAgent', name)
//   }
//   updateDayBefore() {
//     return this.queryableWorker.sendQuery('updateDayBefore')
//   }
//   updateDayAfter() {
//     return this.queryableWorker.sendQuery('updateDayAfter')
//   }
//   updateScores() {
//     this.queryableWorker.sendQuery('updateScores')
//   }
//   static reconstruct(cards) {
//     const res = new PlayerAgentManagerWrapper()
//     res.queryableWorker.sendQuery('reconstruct', null, cards)
//     return res
//   }
// }

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
