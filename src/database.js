import Firebase from 'firebase'

let config = {
  apiKey: "AIzaSyCAR_XDg-b-YWv8VyxvnEng4BQ0wcaWUh0",
  authDomain: "rate-my-roomate-dev.firebaseapp.com",
  databaseURL: "https://rate-my-roomate-dev.firebaseio.com",
  projectId: "rate-my-roomate-dev",
  storageBucket: "rate-my-roomate-dev.appspot.com",
  messagingSenderId: "64430040408"
}

const app = Firebase.initializeApp(config)
const db = app.database()

export default db
