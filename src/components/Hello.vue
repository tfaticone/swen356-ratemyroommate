<template>
  <div class="hello">
    <ul>
      <li v-for="quote in quotes">
        {{quote.quote}}
      </li>
    </ul>
  </div>
</template>

<script>
  import db from '../database'
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    firebase () {
      return {
        quotes: db.ref("quotes")
      }
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
