process.env.DEBUG = 'nuxt:*'
// const express = require('express')

// Create express instance , to test app for firebase
const app = require('express')()

// Require API routes
// const users = require('./routes/users')
// const test = require('./routes/test')

// Import API Routes
// app.use(users)
// app.use(test)

const { Nuxt } = require('nuxt')

// const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 5001

// const isDev = false
// async function start() {
//   // We get Nuxt instance
//   const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

//   // Render every route with Nuxt.js
//   app.use(nuxt.render)

//   // Build only in dev mode with hot-reloading
//   if (isDev) {
//     build(nuxt)
//   }
//   // Listen the server
//   // app.listen(port, '0.0.0.0')
//   // console.log('Server listening on `localhost:' + port + '`.')
// }

// start()
const config = {
  dev: false,
  buildDir: '.nuxt',
  publicPath: '/_nuxt/',
  telemetry: false
}

const nuxt = new Nuxt(config)

async function handleRequest(req, res) {
  await nuxt.ready()
  nuxt.render(req, res)

  // res.set('Cache-Control', 'public, max-age=1200, s-maxage=3600')
  // nuxt
  //   .renderRoute(req.path, { req: req, res: res })
  //   .then((result) => {
  //     res.send(result.html)
  //     return
  //   })
  //   .catch((e) => {
  //     res.send(e)
  //   })
}
app.use(handleRequest)

// Export express app , we can add this as a middleware to nuxt config
// module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
