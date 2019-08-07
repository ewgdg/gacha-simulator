import createPersistedState from 'vuex-persistedstate'
export default ({ store, $playerAgentManager }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'gacha-simulator',
      storage: window.sessionStorage,
      filter: (mutation) => {
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
