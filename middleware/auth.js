export default ({ store, redirect, route }) => {
  // store.commit('setAgentNumber', route.path)
  if (!store.state.user) {
    if (
      !['/', '/redirecting', '/guide', '/signup', '/signin'].includes(
        route.path
      )
    ) {
      return redirect('/signin?from=' + route.path)
    }
  }
}
