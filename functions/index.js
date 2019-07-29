const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore()
const auth = admin.auth()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!')
// })

// exports.createUserProfile = functions.auth.user().onCreate((user) => {
//   let username = user.email.slice(0, user.email.indexOf('@'))
//   return auth
//     .updateUser(user.uid, {
//       displayName: username
//     })
//     .then((userRecord) => {
//       console.log('name ' + userRecord.toJSON())
//       return db
//         .collection('usernames')
//         .doc(user.uid)
//         .set({
//           username: username
//         })
//     })
//     .catch((e) => {
//       console.log(e)
//     })
// })

exports.createUser = functions.https.onCall((data, context) => {
  const createUserPromise = auth.createUser({
    email: data.email,
    emailVerified: false,
    password: data.password,
    displayName: data.username,
    disabled: false
  })

  return createUserPromise
  // let userRecordCopy = null
  // const recordUserNamePromise = createUserPromise
  //   .then((userRecord) => {
  //     userRecordCopy = userRecord
  //     const docRef = db.collection('usernames').doc(userRecord.uid)
  //
  //     return docRef.set({
  //       username: data.username
  //     })
  //   })
  //   .catch(() => {
  //     if (userRecordCopy) {
  //       return auth.deleteUser(userRecordCopy.uid)
  //     }
  //     throw new Error('Failed to record username')
  //   })
  //
  // return Promise.all([createUserPromise, recordUserNamePromise]).then(
  //   (results) => {
  //     return results[0]
  //   }
  // )
})
