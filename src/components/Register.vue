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

  import ErrorDialog from '../partials/Dialog'

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
      register(event) {
        Firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            user.updateProfile({
              displayName: this.firstName + ' ' + this.lastName,
            });
            this.$router.push('/')
          }).catch((error) => {
            this.$refs['dialog'].show(error.code, error.message)
          })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
