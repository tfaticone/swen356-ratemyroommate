<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleSideNav">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">Rate my Roommate</h2>

      <md-button @click.native="showSearch()" class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>

      <md-button v-if="user" @click.native="signOut()">Log Out</md-button>
      <md-button v-else @click.native="showLogIn()">Login / Sign Up</md-button>

    </md-toolbar >

    <md-sidenav md-swipeable class="md-left" ref="sidenav">
      <md-toolbar class="md-large">
        <div class="md-toolbar-container">
          <h3 class="md-title">Sidenav content</h3>
        </div>
      </md-toolbar>
    </md-sidenav>

    <md-dialog ref="loginDialog">
      <md-dialog-title>Login</md-dialog-title>
      <md-dialog-content>
        <login></login>
      </md-dialog-content>
    </md-dialog>

    <md-dialog ref="searchDialog">
      <md-dialog-title class="searchPopup">Search People</md-dialog-title>
      <md-dialog-content>
        <search></search>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
  import Firebase from 'firebase'

  import Login from '../components/Login'
  import Search from '../components/Search.vue'
  import AuthMixin from '../mixins/auth'

  export default {
    name: 'MainNav',
    mixins: [AuthMixin],
    components: {
      Login,
      Search
    },
    beforeCreate() {
      Firebase.auth().onAuthStateChanged((user) => {
        if (user) this.$refs['loginDialog'].close()
      })
    },
    methods: {
      toggleSideNav() {
        this.$refs['sidenav'].toggle()
      },
      showLogIn() {
        this.$refs['loginDialog'].open()
      },
      showSearch() {
        this.$refs['searchDialog'].open()
      }
    }
  }
</script>

<style scoped>
  .searchPopup {
    width: 75vw;
  }
</style>
