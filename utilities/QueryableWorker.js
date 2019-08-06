/*
      https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
      QueryableWorker instances methods:
        * sendQuery(queryable function name, argument to pass 1, argument to pass 2, etc. etc): calls a Worker's queryable function
        * postMessage(string or JSON Data): see Worker.prototype.postMessage()
        * terminate(): terminates the Worker
        * addListener(name, function): adds a listener
        * removeListener(name): removes a listener
      QueryableWorker instances properties:
        * defaultListener: the default listener executed only when the Worker calls the postMessage() function directly
     */
function QueryableWorker(workerInstance, onError) {
  const instance = this
  const worker = workerInstance
  const listeners = {}
  const resultQueues = {}
  this.defaultListener = function(data) {
    console.log('message')
    console.log(data)
    const queryMethodListener = data.queryMethodListener
    const queryMethodArguments = data.queryMethodArguments

    if (resultQueues[queryMethodListener]) {
      const resolver = resultQueues[queryMethodListener].shift()
      resolver(queryMethodArguments || 'resolved')
    }
  }

  if (onError) {
    worker.onerror = onError
  }

  this.postMessage = function(message) {
    worker.postMessage(message)
  }

  this.terminate = function() {
    worker.terminate()
  }

  this.addListener = function(name, listener) {
    listeners[name] = listener
  }

  this.removeListener = function(name) {
    delete listeners[name]
  }

  function objectSetterFactory(obj) {
    return function(value) {
      obj.data = value
    }
  }
  /*
    This functions takes at least one argument, the method name we want to query.
    Then we can pass in the arguments that the method needs.
  */
  this.sendQuery = function() {
    if (arguments.length < 1) {
      throw new TypeError(
        'QueryableWorker.sendQuery takes at least one argument'
      )
    }
    // add a promise to resultQueues
    const queryMethod = arguments[0]
    console.log(queryMethod)
    let promiseResolver
    const promiseResult = new Promise((resolve) => {
      promiseResolver = resolve
    })

    if (!resultQueues[queryMethod]) {
      resultQueues[queryMethod] = []
    }
    resultQueues[queryMethod].push(promiseResolver)

    worker.postMessage({
      queryMethod: queryMethod,
      queryMethodArguments: Array.prototype.slice.call(arguments, 1)
    })
    return promiseResult
  }

  this.sendQuerySync = function() {
    if (arguments.length < 1) {
      throw new TypeError(
        'QueryableWorker.sendQuery takes at least one argument'
      )
    }
    const queryMethod = arguments[0]
    console.log(queryMethod)
    const result = {}
    const resolver = objectSetterFactory(result)

    if (!resultQueues[queryMethod]) {
      resultQueues[queryMethod] = []
    }
    resultQueues[queryMethod].push(resolver)

    worker.postMessage({
      queryMethod: queryMethod,
      queryMethodArguments: Array.prototype.slice.call(arguments, 1)
    })

    while (!result.data) {
      setTimeout(null, 0)
    }

    return result
  }

  worker.onmessage = (event) => {
    // console.log(event)
    // if (
    //   event.data instanceof Object &&
    //   event.data.hasOwnProperty('queryMethodListener') &&
    //   event.data.hasOwnProperty('queryMethodArguments')
    // ) {
    //   this.defaultListener.call(instance, event.data)
    //   listeners[event.data.queryMethodListener].apply(
    //     instance,
    //     event.data.queryMethodArguments
    //   )
    // } else {
    // console.log(this.defaultListener)
    this.defaultListener.call(instance, event.data)
    // }
  }
}

export default QueryableWorker
