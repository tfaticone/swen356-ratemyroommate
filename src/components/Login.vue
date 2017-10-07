<template>
  <md-layout md-gutter>
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

        <error-dialog ref="dialog"></error-dialog>
      </form>
    </md-layout>

    <md-layout md-column>
      <md-button class="md-raised md-accent" @click.native="googleSignin">Log in with google</md-button>
    </md-layout>
  </md-layout>
</template>

<script>
  import Firebase from 'firebase'

  import ErrorDialog from '../partials/Dialog'

  export default {
    name: 'login',
    components: {
      ErrorDialog
    },
    data () {
      return {
        email: '',
        password: '',
        error: {
          title: '',
          content: '',
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
        this.$refs['dialog'].show(error.code, error.message)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
