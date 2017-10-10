<template>
  <div>
    {{user}}
    <h1>{{user.first_name + user.last_name}}</h1>
  </div>
</template>

<script>
  import db from '../database';
  var schools_ref = db.ref('schools/');

  export default {
    name : 'profile',
    data :  function() {
      var user_ref = schools_ref.child(this.$route.params.school).child(this.$route.params.user);
      var data = { user : null}

      user_ref.on('value', function (snap) {
        data.user = snap.val();
      })

      return data;
    },
    firebase : {


    }
  }
</script>
