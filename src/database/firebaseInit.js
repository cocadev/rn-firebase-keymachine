import firebaseConfig from './firebaseConfig'
import Firebase from '@firebase/app'
import '@firebase/firestore'

const firebaseApp = Firebase.initializeApp(firebaseConfig)

const api = firebaseApp.firestore()

export default api
