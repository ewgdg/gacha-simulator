import PlayerAgentManager from '~/app/managers/PlayerAgentManager'

let playerAgentManger = new PlayerAgentManager()

onmessage = function(e) {
  console.log(e.data)
  const data = e.data
  const queryMethod = data.queryMethod
  const queryMethodArguments = data.queryMethodArguments
  if (typeof playerAgentManger[queryMethod] === 'function') {
    const res = playerAgentManger[queryMethod].apply(
      playerAgentManger,
      queryMethodArguments
    )
    reply(queryMethod, res)
  } else if (queryMethod === 'reconstruct') {
    playerAgentManger = PlayerAgentManager.reconstruct(queryMethodArguments)
  }
}

function reply() {
  if (arguments.length < 1) {
    throw new Error('reply - takes at least one argument')
  }
  postMessage({
    queryMethodListener: arguments[0],
    queryMethodArguments: Array.prototype.slice.call(arguments, 1)
  })
}
