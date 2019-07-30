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

  return createUserPromise.catch(() => {
    throw new functions.https.HttpsError('aborted', 'Failed to create user.')
  })
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

// exports.uploadScore = functions.https.onCall((data, context) => {
//   // console.log(context.auth)
//
//   //upload the score into collection scores
//   //delete score if the user has more than 10 copies
//   if (!context.auth || data.uid !== context.auth.uid) {
//     throw new functions.https.HttpsError('unauthenticated', 'Permission Denied')
//   }
//   //make it a function bc the update need to calculate global rank at the same time;
//   const score = data.score
//   const timeStamp = Date.now()
//
//   let globalRankRef = db
//     .collection('globalRank')
//     .orderBy('score', 'desc')
//     .limit(10)
//
//   let userDocRef = db.collection('users').doc(data.uid)
//   let maxCount = 10
//   db.runTransaction((transaction) => {
//     return transaction
//       .get(userDocRef)
//       .then((userDoc) => {
//         let ref
//         if (userDoc.data().count < maxCount) {
//           transaction.update(userDocRef, { count: userDoc.data().count + 1 })
//           ref = db.collection('scores').doc()
//         } else {
//           ref = transaction
//             .get(
//               db
//                 .collection('scores')
//                 .where('username', '==', data.username)
//                 .orderBy('timeStamp', 'asc')
//                 .limit(1)
//             )
//             .then((doc) => doc.ref)
//         }
//         return ref
//       })
//       .then((ref) => {
//         transaction.set(ref, {
//           username: data.username,
//           score: score,
//           localRank: data.localRank,
//           timeStamp: timeStamp
//         })
//         return null
//       })
//   })
// })
// exports.updateRank = functions.https.onCall((data, context) => {
//   // console.log(context.auth)
//   if (!context.auth) {
//     throw new functions.https.HttpsError('unauthenticated', 'Permission Denied')
//   }
// })
