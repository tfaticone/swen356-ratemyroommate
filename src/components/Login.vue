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

        <md-dialog ref="errorDialog">
          <md-dialog-title>{{errorTitle}}</md-dialog-title>
          <md-dialog-content>{{error}}</md-dialog-content>

          <md-dialog-actions>
            <!-- TODO: Reset password button -->
            <md-button class="md-primary" @click="closeDialog('errorDialog')">Ok</md-button>
          </md-dialog-actions>
        </md-dialog>
      </form>
    </md-layout>

    <md-layout md-column>
      <md-button class="md-raised md-accent" @click.native="googleSignin">Log in with google</md-button>
    </md-layout>
  </md-layout>
</template>

<script>
  import Firebase from 'firebase';

  export default {
    name: 'login',
    data () {
      return {
        email: undefined,
        password: undefined,
        errorTitle: undefined,
        error: undefined
      };
    },
    methods: {
      login(event) {
        Firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              this.errorTitle = "Incorrect Password"
              this.error = "Please enter the correct one"
              openDialog('errorDialog')
            } else {
              this.error = errorMessage
              openDialog('errorDialog')
            }
          });
      },
      googleSignin(event) {
        const provider = new Firebase.auth.GoogleAuthProvider();
        Firebase.auth().signInWithPopup(provider).then((result) => {
          //console.log(result.user.email)
          var token = result.credential.accessToken;
          const user = result.user;
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = error.credential;
        });
      },
      openDialog(ref) {
        this.$refs[ref].open();
      },
      closeDialog(ref) {
        this.$refs[ref].close();
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
