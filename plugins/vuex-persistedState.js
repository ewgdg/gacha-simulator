// import VuexPersistence from 'vuex-persist'
//
// export default ({ store }) => {
//   window.onNuxtReady(() => {
//     new VuexPersistence({
//       storage: window.sessionStorage
//     }).plugin(store)
//   })
// }

import createPersistedState from 'vuex-persistedstate'
export default ({ store, $playerAgentManager }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'gacha-simulator',
      storage: window.sessionStorage,
      filter: (mutation) => {
        // console.log(mutation)
        // if (['increaseProgress'].includes(mutation.type)) {
        //   return false
        // }
        // if (mutation.type === 'modules/playerAgents/mutate') {
        //   const payload = mutation.payload
        //   const path = Array.isArray(payload.path)
        //     ? payload.path
        //     : payload.path.split('.')
        //   if (path.length > 0 && path[0] === 'agents') {
        //     return false
        //   }
        // }
        if (
          mutation.type === 'persistData' ||
          mutation.type === 'persistGameState'
        ) {
          return true
        }
        return false
      },
      reducer: (state, paths) => {
        // need a deep copy bc dont want to mutate the state
        // const res = JSON.parse(JSON.stringify(state))
        // agent is handle by another plugin agent manager
        // delete res.modules.playerAgents.agents
        return state
      }
    })(store)
  })
}
