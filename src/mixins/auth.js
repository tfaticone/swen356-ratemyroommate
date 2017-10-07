import Firebase from 'firebase'

// Import database so that it gets initialized
import '../database'

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
