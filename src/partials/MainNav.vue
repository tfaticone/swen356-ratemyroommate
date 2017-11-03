<template>
  <div>
    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleSideNav">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title" style="flex: 1">Rate my Roommate</h2>

      <md-button @click.native="$router.push('/search')" class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>

      <md-button v-if="user" @click.native="signOut()">Log Out</md-button>
      <md-button v-else @click.native="$router.push('/login')">Login / Sign Up</md-button>

    </md-toolbar >

    <md-sidenav md-swipeable class="md-left" ref="sidenav">
      <md-toolbar class="md-large">
        <div class="md-toolbar-container">
          <h3 class="md-title">Sidenav content</h3>
        </div>
      </md-toolbar>
    </md-sidenav>
  </div>
</template>

<script>
  import AuthMixin from '../mixins/auth'

  export default {
    name: 'MainNav',
    mixins: [AuthMixin],
    methods: {
      toggleSideNav() {
        this.$refs['sidenav'].toggle()
      }
    }
  }
</script>

<style scoped>

</style>
