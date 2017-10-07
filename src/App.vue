<template>
  <div id="app">
    <main-nav></main-nav>
    <router-view class="main-content"></router-view>
  </div>
</template>

<script>
  import MainNav from './partials/MainNav'

  export default {
    name: 'app',
    components: {
      MainNav
    }
  }
</script>

<style scoped>
  .main-content {
    padding: 16px;
  }
</style>
