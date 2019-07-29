const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!')
})

exports.createUserProfile = functions.auth.user().onCreate((user) => {
  let username = user.email.slice(0, user.email.indexOf('@'))
  return db
    .collection('usernames')
    .doc(user.uid)
    .set({
      username: username
    })
})
