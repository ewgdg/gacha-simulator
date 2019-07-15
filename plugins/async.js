const executeAsync = (func) => {
  setTimeout(func, 0)
}

export default ({ app }, inject) => {
  inject('executeAsync', executeAsync)
  // app.executeAsync = (func) => {
  //   setTimeout(func, 0)
  // }
}
