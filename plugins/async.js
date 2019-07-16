const executeAsync = (func) => {
  setTimeout(func, 0)
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default ({ app }, inject) => {
  inject('executeAsync', executeAsync)
  // app.executeAsync = (func) => {
  //   setTimeout(func, 0)
  // }
  // inject('yieldControl', yieldControl)
  inject('wait', wait)
}
