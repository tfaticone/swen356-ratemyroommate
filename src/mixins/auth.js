import Firebase from 'firebase'

export default {
  data() {
    return {
      user: null
    }
  },
  beforeCreate() {
    Firebase.auth().onAuthStateChanged((user) => {
      this.user = user
    })
  }
}
