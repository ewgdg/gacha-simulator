// const isDev = true
// process.env.DEBUG = isDev ? '*' : ''
process.env.NODE_ENV = 'production'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
const auth = admin.auth()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!')
// })

exports.createUser = functions.https.onCall((data, context) => {
  const createUserPromise = auth.createUser({
    email: data.email,
    emailVerified: false,
    password: data.password,
    displayName: data.username,
    disabled: false
  })

  return createUserPromise.catch(() => {
    throw new functions.https.HttpsError('aborted', 'Failed to create user.')
  })
})

const app = require('express')()
const { Nuxt } = require('nuxt')

// const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

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
  for: 'start',
  ready: true,
  buildDir: '.nuxt',
  publicPath: '/_nuxt/', //set to url of local hosting server in dev?
  telemetry: false // the telemetry question is preventing app from rendering
}

const nuxt = new Nuxt(config)

let prev_req = null

async function handleRequest(req, res) {
  // nuxt.render has issue dealing with first req from firebase if not waiting for ready

  await nuxt.ready()
  res.set('Cache-Control', 'public, max-age=1200, s-maxage=3600')
  nuxt.render(req, res)
  return
  // res.set('Cache-Control', 'public, max-age=1200, s-maxage=3600')
  // nuxt
  //   .renderRoute(req.path, { req: req, res: res })
  //   .then((result) => {
  //     res.send(result.html)
  //     return
  //   })
  //   .catch((e) => {
  //     res.send(e)
  //     return
  //   })
}

// app.use(handleRequest)
// app.use(nuxt.render)
app.get('*', handleRequest)
exports.app = functions.https.onRequest(app)
