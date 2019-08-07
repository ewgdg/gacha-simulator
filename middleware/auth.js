export default ({ store, redirect, route }) => {
  // store.commit('setAgentNumber', route.path)
  if (!store.state.user) {
    if (
      ![
        '/',
        '/redirecting',
        '/guide',
        '/signup',
        '/signin',
        '/signup/success'
      ].includes(route.path)
    ) {
      return redirect('/signin?from=' + route.path)
    }
  }
}
