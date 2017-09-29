<template>
  <div class="register">
    <div style="margin: 0 auto;">
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
          <label>College</label>
          <md-input v-model="college" required></md-input>
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
    </div>
  </div>
</template>

<script>
  import db from '../database';
  import Firebase from 'firebase';

  export default {
    name: 'register',
    data () {
      return {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        college: undefined,
        password: undefined,
      };
    },
    methods: {
      register: function(event) {
        Firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
      },
    },
    firebase () {
      return {};
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
