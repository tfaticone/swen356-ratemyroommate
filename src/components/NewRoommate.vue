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
            <md-option v-for="(school,schoolid) in globalSchools" :value="school.domain">{{ school.name }}</md-option>
          </md-select>
        </md-input-container>

        <md-button type="submit" class="md-raised md-primary">Register Roommate</md-button>
      </form>

      <error-dialog ref="dialog"></error-dialog>
    </md-layout>
</template>

<script>
  import Firebase from 'firebase'

  import ErrorDialog from '../partials/Dialog'
  import db from '../database';

  const users = db.ref('users');
  const schools = db.ref('schools');

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
        college: '',
      };
    },
    firebase() {
      return {
        globalSchools: {
          source: schools,
          asObject: false
        }
      }
    },
    methods: {
      register(event) {
        //register the roommate
        console.log(this.globalSchools);
        let newRoomateObj = {};
        newRoomateObj.firstName = this.firstName;
        newRoomateObj.lastName = this.lastName;
        newRoomateObj.overallRating = 0.0;

        let username = this.email.substring(0,this.email.lastIndexOf("@"));
        let domain = this.email.substring(this.email.lastIndexOf("@") + 1, this.email.lastIndexOf("."));
        newRoomateObj.college = this.college;
        newRoomateObj.username = username;

        if(domain !== this.college) {
          alert("The email does not match the domain of the college. Please enter a valid college and email.");
          return;
        }

        users.child(this.college).child(username).once('value', (snapshot) => {
          let exists = (snapshot.val() !== null);

          if(exists) {
            alert("This user is already in database!");
            return;
          } else {
            users.child(this.college).child(username).set(newRoomateObj);
            window.location.replace("/#/schools/" + this.college + "/" + username);
          }
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
