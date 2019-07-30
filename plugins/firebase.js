import Vue from 'vue'

const firebaseConfig = {
  apiKey: 'AIzaSyBbYZfAgwaxkFIn--EEnQesdiReKk43RTY',
  authDomain: 'gacha-simulator-f6d91.firebaseapp.com',
  databaseURL: 'https://gacha-simulator-f6d91.firebaseio.com',
  projectId: 'gacha-simulator-f6d91',
  storageBucket: 'gacha-simulator-f6d91.appspot.com',
  messagingSenderId: '948523657827',
  appId: '1:948523657827:web:814c2ee51a109a23'
}

// let auth, db, functions, firebase
const firebase = window.firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const auth = firebase.auth()
const functions = firebase.functions()

// console.log('env is ' + process.env.NODE_ENV)
// if (process.env.NODE_ENV === 'development') { //this is for server side node.js env
//   firebase = require('@firebase/testing')
//   firebase.initializeTestApp({
//     projectId: 'my-project',
//     auth: { uid: 'tester', email: 'test@domain.com' }
//   })
//   db = firebase.firestore()
//   auth = firebase.auth()
//   functions = firebase.functions()
//   // functions.useFunctionsEmulator('http://localhost:5001')
// }
Vue.prototype.$functions = functions
Vue.prototype.$db = db
Vue.prototype.$auth = auth
export default ({ store }) => {
  // listen to the auth state
  auth.onAuthStateChanged((user) => {
    if (user) {
      store.commit('setUser', { displayName: user.displayName, uid: user.uid })
    } else {
      store.commit('setUser', null)
    }
  })
}

const uploadScore = (data) => {
  const userDocRef = db.collection('users').doc(data.uid)
  const maxCount = 10
  // aggregate highest score by user
  // store current score
  // delete score if exceed max count per user
  return db.runTransaction((transaction) => {
    return transaction
      .get(userDocRef)
      .then((userDoc) => {
        let read_data = {}
        if (!userDoc.exists) {
          read_data.count = 0
          read_data.highest_score = Number.NEGATIVE_INFINITY
          read_data.timeStamp = null
        } else {
          read_data = userDoc.data()
          if (!read_data.highest_score) {
            read_data.highest_score = Number.NEGATIVE_INFINITY
          }
        }

        const updatedData = { username: data.username }
        if (data.score > read_data.highest_score) {
          updatedData.highest_score = data.score
          updatedData.timeStamp = firebase.firestore.FieldValue.serverTimestamp()
        } else {
          updatedData.highest_score = read_data.highest_score
          updatedData.timeStamp = read_data.timeStamp
        }

        let ref
        if (read_data.count < maxCount) {
          updatedData.count = read_data.count + 1
          // transaction.set(userDocRef, { count: count + 1 }, { merge: true })
          ref = db.collection('scores').doc()
        } else {
          // transaction.update(userDocRef, {})
          updatedData.count = read_data.count
          ref = db
            .collection('scores')
            .where('username', '==', data.username)
            .orderBy('timeStamp', 'asc')
            .limit(1)
            .get()
            .then((querySnapshot) => {
              return querySnapshot.docs[0]
            })
            .then((doc) => {
              // console.log(doc.data().uid === data.uid)
              return doc.ref
            })
        }

        transaction.set(userDocRef, updatedData, { merge: true })
        return ref
      })
      .then((ref) => {
        const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
        transaction.set(ref, {
          username: data.username,
          uid: data.uid,
          score: data.score,
          localRank: data.localRank,
          timeStamp: timeStamp
        })
        return null
      })
  })
}
const getGlobalRank = () => {
  const res = []
  return db
    .collection('users')
    .orderBy('highest_score', 'desc')
    .limit(10)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data()
        res.push({
          name: data.username,
          score: data.highest_score
        })
      })
    })
    .then(() => {
      return res
    })
}
Vue.prototype.$uploadScore = uploadScore
Vue.prototype.$getGlobalRank = getGlobalRank
