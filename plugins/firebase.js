import Vue from 'vue'
import { eventBus } from './eventBus'
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

const getScores = (uid) => {
  const res = []
  return db
    .collection('scores')
    .where('uid', '==', uid)
    .orderBy('timeStamp', 'desc')
    .limit(10)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        res.push(doc.data())
      })
      return res
    })
}

let storeRef = null
export default ({ store }) => {
  window.onNuxtReady(() => {
    storeRef = store
  })

  // listen to the auth state
  auth.onAuthStateChanged((user) => {
    if (user) {
      // prevent user from performing any action
      eventBus.$emit('block')
      if (!store.state.user || store.state.user.uid !== user.uid) {
        store.commit('setUser', {
          displayName: user.displayName,
          uid: user.uid,
          highest_score: 'Unset'
        })
      }

      let getHighestScorePromise = Promise.resolve()
      if (store.state.user.highest_score === 'Unset') {
        const userDocRef = db.collection('users').doc(user.uid)
        getHighestScorePromise = userDocRef.get().then((doc) => {
          let highest_score = 'None'
          if (doc.exists && doc.data().highest_score) {
            highest_score = doc.data().highest_score
          }
          store.commit('setUser', {
            ...store.state.user,
            highest_score: highest_score
          })
        })
      }
      let getScorePromise = Promise.resolve()
      if (!store.state.userHistory.length) {
        getScorePromise = getScores(user.uid).then((res) => {
          store.commit('setUserHistory', res)
        })
      }
      Promise.all([getScorePromise, getHighestScorePromise])
        .catch((e) => {
          console.log(e)
        })
        .then(() => {
          eventBus.$emit('unblock')
        })
    } else {
      store.commit('setUser', null)
      store.commit('setUserHistory', [])
      store.commit('setGlobalRankTable', [])
    }
  })
}

const waitForNuxt = new Promise((resolve) => {
  window.onNuxtReady(() => {
    resolve()
  })
})

const uploadScore = (data) => {
  const userDocRef = db.collection('users').doc(data.uid)
  const maxCount = 10
  // aggregate highest score by user
  // store current score
  // delete score if exceed max count per user
  let highest_score = 'None'
  eventBus.$emit('block')
  return db
    .runTransaction((transaction) => {
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
            updatedData.timeStamp = firebase.firestore.FieldValue.serverTimestamp() // read_data.timeStamp
          }
          highest_score = updatedData.highest_score

          // delete extra score
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
              .where('uid', '==', data.uid)
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
          // write score into scores
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
    .then(async () => {
      // update local data

      storeRef.commit('setUser', {
        ...storeRef.state.user,
        highest_score: highest_score
      })
      // }
      // console.log('waiting for nuxt')
      await waitForNuxt
      // console.log('end waiting for nuxt')
      db.collection('scores')
        .where('uid', '==', data.uid)
        .orderBy('timeStamp', 'desc')
        .limit(1)
        .get()
        .then((querySnapshot) => {
          const res = storeRef.state.userHistory.slice(0)
          querySnapshot.forEach((doc) => {
            res.unshift(doc.data())
          })
          storeRef.commit('setUserHistory', res.slice(0, 10))
        })
    })
    .catch((e) => {
      console.log(e)
    })
    .then(() => {
      // console.log('i am here')
      eventBus.$emit('unblock')
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
Vue.prototype.$getScores = getScores
