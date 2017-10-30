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

        <md-button type="submit" class="md-raised md-primary">Register Roommate</md-button>
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
        college: '',
      };
    },
    methods: {
      register(event) {
        //register the roommate
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
