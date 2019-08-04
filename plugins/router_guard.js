// export default ({ app, store, route }) => {
//   if (process.server) return
//   window.onNuxtReady(() => {
//     app.router.beforeEach((to, from, next) => {
//       if (!store.state.user && to.path === '/play') {
//         if (from.path === '/signin') {
//           // next(false)
//         }
//         next('/signin')
//       }
//       next()
//     })
//   })
// }
