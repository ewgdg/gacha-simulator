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
      key: 'gacha-simulator'
    })(store)
  })
}
