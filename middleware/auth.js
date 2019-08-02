export default ({ store, redirect, route }) => {
  if (!store.state.user) {
    if (
      !['/', '/redirecting', '/guide', '/signup', '/signin'].includes(
        route.path
      )
    ) {
      redirect('/signin?from=' + route.path)
    }
  }
}
