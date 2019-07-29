import Vue from 'vue'

const firebase = window.firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBbYZfAgwaxkFIn--EEnQesdiReKk43RTY',
  authDomain: 'gacha-simulator-f6d91.firebaseapp.com',
  databaseURL: 'https://gacha-simulator-f6d91.firebaseio.com',
  projectId: 'gacha-simulator-f6d91',
  storageBucket: 'gacha-simulator-f6d91.appspot.com',
  messagingSenderId: '948523657827',
  appId: '1:948523657827:web:814c2ee51a109a23'
}
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const auth = firebase.auth()
Vue.prototype.$db = db
Vue.prototype.$auth = auth
Vue.prototype.$functions = firebase.functions()

export default ({ store }) => {
  // console.log(store)
  auth.onAuthStateChanged((user) => {
    // console.log(user)
    if (user) {
      store.commit('setUser', { displayName: user.displayName, uid: user.uid })
    } else {
      store.commit('setUser', null)
    }
  })
}
