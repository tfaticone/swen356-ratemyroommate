<template>
  <div>
    <md-toolbar>
      <h2 class="md-title" style="flex: 1">Rate my Roommate</h2>

      <md-button class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>

      <md-button v-if="loggedIn">My Profile</md-button>
      <md-button v-else @click.native="$router.push('/login')">Login / Sign Up</md-button>

    </md-toolbar>
  </div>
</template>

<script>
  import Firebase from 'firebase'

  export default {
    name: 'MainNav',
    data() {
      return {
        loggedIn: false
      }
    },
    beforeCreate() {
      Firebase.auth().onAuthStateChanged((user) => {
        this.loggedIn = user !== null
      })
    }
  }
</script>

<style scoped>

</style>
