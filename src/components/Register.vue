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
          <label for="college">College</label>
          <md-select id="college" v-model="college">
            <md-option value="monroe_community_college">Monroe Community College</md-option>
            <md-option value="university_of_rochester">University of Rochester</md-option>
            <md-option value="rochester_institute_of_technology">Rochester Institute of Technology</md-option>
            <md-option value="suny_geneseo">SUNY Geneseo</md-option>
            <md-option value="empire_state_college">Empire State College</md-option>
            <md-option value="st_john_fisher_college">St. John Fisher College</md-option>
            <md-option value="nazareth_college">Nazareth College</md-option>
          </md-select>
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

      <md-dialog ref="errorDialog">
        <md-dialog-title>{{errorDialog.title}}</md-dialog-title>
        <md-dialog-content>{{errorDialog.content}}</md-dialog-content>
      </md-dialog>
    </md-layout>
</template>

<script>
  import Firebase from 'firebase'

  export default {
    name: 'register',
    data () {
      return {
        firstName: '',
        lastName: '',
        email: '',
        college: '',
        password: '',
        errorDialog: {
          title: '',
          content: ''
        }
      }
    },
    methods: {
      register() {
        Firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then((user) => {
            user.updateProfile({
              displayName: this.firstName + ' ' + this.lastName,
            });
            this.$router.push('/')
          }).catch((error) => {
            this.errorDialog.title = error.code
            this.errorDialog.content = error.message
            this.$refs['errorDialog'].open()
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
