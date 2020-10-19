const express = require('express')

// Create express instance , to test app for firebase
const app = express()

// Require API routes
// const users = require('./routes/users')
// const test = require('./routes/test')

// Import API Routes
// app.use(users)
// app.use(test)

const { loadNuxt, build, Nuxt } = require('nuxt')

// const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

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
  publicPath: '/_nuxt/'
}

const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Export express app , we can add this as a middleware to nuxt config
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
