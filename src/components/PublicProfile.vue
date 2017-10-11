<template>
  <div>
    <h1>
      {{user.first_name + " " + user.last_name + " at " + user.college}}
    </h1>
    <h2>
      Average Ratings:
    </h2>
    <h3>
      {{averages}}
    </h3>

  </div>
</template>

<script>
  import db from '../database';
  var schools_ref = db.ref('schools/');

  export default {
    name : 'profile',
    data :  function() {
      const user_ref = schools_ref.child(this.$route.params.school).child(this.$route.params.user);
      const data = {
        user : undefined,
        averages : undefined,
      };

      user_ref.on('value', (snap) => {
        data.user = snap.val();

        const values = {};
        data.user.reviews.forEach((review) => {
          Object.keys(review.ratings).forEach((key)=>
          {
            if (!values[key]) {
              values[key] = [review.ratings[key]];
            }
            else {
              values[key].push(review.ratings[key])
            }
          });
        });

        const averages ={};
        Object.keys(values).forEach((key)=>{
          let count = 0;
          let sum = 0;
          values[key].forEach((num) =>{
            sum += num;
            count++;
          });
          averages[key] = sum / count;
        });
        data.averages = averages;

      });

      return data;
    }
  }
</script>
