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
export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'gacha-simulator',
      storage: window.sessionStorage,
      filter: (mutation) => {
        if (
          [
            'setWeights',
            'setWTP_reverse',
            'setMinWTP',
            'setMaxWTP',
            'setWTP',
            'addCard',
            'agentRecordPayment',
            'addBalance',
            'setAgentEstimatedDailyDraw',
            'setWTP_reverse_sum',
            'setTotalDailyDraw',
            'setTotalWTP',
            'increaseDrawFrequency',
            'increaseId',
            'setPlayerRank',
            'setScore',
            'addAgent',
            'increaseProgress'
          ].includes(mutation.type)
        ) {
          return false
        }
        return true
      }
      // paths: [
      //   'users',
      //   'modules.playerAgents',
      //   'modules.lootbox',
      //   'modules.card',
      //   'modules.statistics',
      //   'modules.messages',
      //   'modules.'
      // ]
    })(store)
  })
}
