<template>
    <md-layout md-column>
      <form novalidate @submit.stop.prevent="register">
        <md-input-container>
          <label>First Name</label>
          <md-input v-model="firstName" required></md-input>
        </md-input-container>

        <md-input-container>
          <label>Last Name</label>
          <md-input v-model="lastName" required></md-input>
        </md-input-container>

        <md-input-container>
          <label>Email</label>
          <md-input v-model="email" required></md-input>
        </md-input-container>

        <md-input-container>
          <label>Password</label>
          <md-input v-model="password" required type="password"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Confirm Password</label>
          <md-input required type="password"></md-input>
        </md-input-container>

        <md-button type="submit" class="md-raised md-primary">Register</md-button>
      </form>

      <error-dialog ref="dialog"></error-dialog>
    </md-layout>
</template>

<script>
  import Firebase from 'firebase'
  import db from '../database'

  import ErrorDialog from '../partials/Dialog'

  const usersRef = db.ref('/users')

  export default {
    name: 'register',
    components: {
      ErrorDialog
    },
    data () {
      return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      };
    },
    methods: {
      register() {
        Firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            user.updateProfile({
              displayName: this.firstName + ' ' + this.lastName,
            });

            let userRef = usersRef
              .child('TODO') // TODO get email domain
              .child('TODO') // TODO get user email

            userRef.push('firstName', this.firstName)
            userRef.push('lastName', this.lastName)
            userRef.push('college', 'TODO') // TODO get email domain
            userRef.push('userName', 'TODO') // TODO get user email

            this.$router.push('/')
          }).catch((error) => {
            this.$refs['dialog'].show(error.code, error.message)
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
