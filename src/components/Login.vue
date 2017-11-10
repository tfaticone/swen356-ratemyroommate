<template>
  <md-layout md-column>
    <form novalidate @submit.stop.prevent="login">
      <md-input-container>
        <label>Email</label>
        <md-input v-model="email" required></md-input>
      </md-input-container>

      <md-input-container>
        <label>Password</label>
        <md-input v-model="password" required type="password"></md-input>
      </md-input-container>

      <md-button type="submit" class="md-raised md-primary" >Log in</md-button>

      <router-link to="Register">
        <md-button class="md-raised md-secondary">Register</md-button>
      </router-link>

      <md-dialog ref="errorDialog">
        <md-dialog-title>{{errorDialog.title}}</md-dialog-title>
        <md-dialog-content>{{errorDialog.content}}</md-dialog-content>
      </md-dialog>
    </form>

    <h3>Or</h3>

    <md-button class="md-raised md-accent" @click.native="googleSignin">Log in with google</md-button>
  </md-layout>
</template>

<script>
  import Firebase from 'firebase'

  export default {
    name: 'login',
    data () {
      return {
        email: '',
        password: '',
        errorDialog: {
          title: '',
          content: ''
        }
      }
    },
    methods: {
      login() {
        Firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(this.onSignInSuccess)
          .catch(this.onSignInError)
      },
      googleSignin() {
        Firebase.auth().signInWithPopup(new Firebase.auth.GoogleAuthProvider())
          .then(this.onSignInSuccess)
          .catch(this.onSignInError)
      },
      onSignInSuccess(firebaseUser) {
        this.$router.push('/')
      },
      onSignInError(error) {
        this.errorDialog.title = error.code
        this.errorDialog.content = error.message
        this.$refs['errorDialog'].open()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-layout {
  text-align: center;
}
</style>
