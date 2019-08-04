const executeAsync = (func) => {
  setTimeout(func, 0)
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function waitForAnimation() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}

export const waitForNuxt = process.client
  ? new Promise((resolve) => {
      window.onNuxtReady(resolve)
    })
  : Promise.resolve()
export default ({ app }, inject) => {
  inject('executeAsync', executeAsync)
  // app.executeAsync = (func) => {
  //   setTimeout(func, 0)
  // }
  // inject('yieldControl', yieldControl)
  inject('wait', wait)
  inject('waitForAnimation', waitForAnimation)
  inject('waitForNuxt', waitForNuxt)
}
