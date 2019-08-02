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

const { Nuxt } = require('nuxt-start')
const app = require('express')()

const config = {
  dev: false,
  buildDir: '.nuxt',
  publicPath: '/_nuxt/'
}

const nuxt = new Nuxt(config)

function handleRequest(req, res) {
  res.set('Cache-Control', 'public, max-age=1200, s-maxage=3600')
  nuxt
    .renderRoute(req.path)
    .then((result) => {
      res.send(result.html)
      return
    })
    .catch((e) => {
      res.send(e)
    })
}

app.get('*', handleRequest)
// app.use(handleRequest)

exports.app = functions.https.onRequest(app)

exports.uploadScore = functions.https.onCall((data, context) => {
  if (context.auth.uid === null) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Failed to auth user.'
    )
  }
  return uploadScore(data)
})
