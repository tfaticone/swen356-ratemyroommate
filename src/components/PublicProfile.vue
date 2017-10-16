<template>
  <div>
    <h1>
      {{ user.firstName + " " + user.lastName + " at " + school + " (" + userId + ")" }}
    </h1>
    <h2>
      Overall Rating:
    </h2>
    <h2>
      {{ overallRating }}
      <md-rating-bar v-model="overallRating" :md-max-rating="5" class="md-primary" :md-empty-icon="'star_border'" disabled></md-rating-bar>
    </h2>
    <h3 v-for="(value, key) in ratingAverages">
      {{ key }}: {{ value }}
    </h3>
    <h3 v-for="attr in attributes">
      {{ attr[0] }}: {{ attr[1] }}
    </h3>
    <h2>
      Reviews:
    </h2>
    <div v-for="(review, reviewId) in user.reviews">
      <div v-for="(value, rating) in review.ratings">
        {{ rating }}: {{ value }}
      </div>
      {{ review.comment }}
    </div>
  </div>
</template>

<script>
  import db from '../database';
  import util from '../util/util';

  export default {
    name : 'profile',
    data :  function() {
      const data = {
        school: this.$route.params.school,
        userId: this.$route.params.user,
        user: undefined,
        overallRating: undefined,
        ratingAverages: undefined,
        attributes: undefined,
      };

      const user_ref = db.ref(`schools/${this.$route.params.school}/${this.$route.params.user}`);
      user_ref.on('value', (snap) => {
        data.user = snap.val();

        // tally up attributes and ratings
        const attributes = {}; // smokes, has pet, etc.
        const ratings = {}; // loudness, politeness, etc.
        Object.keys(data.user.reviews).forEach((reviewId) => {
          const review = data.user.reviews[reviewId];

          // attributes
          Object.keys(review.attributes).forEach((attrKey) => {
            if (!attributes[attrKey]) {
              attributes[attrKey] = 0
            }
            if (review.attributes[attrKey] === true) {
              attributes[attrKey] += 1;
            } else {
              attributes[attrKey] -= 1;
            }
          });

          // ratings
          Object.keys(review.ratings).forEach((key) => {
            if (!ratings[key]) {
              ratings[key] = [];
            }
            ratings[key].push(review.ratings[key]);
          });
        });
        data.attributes = util.sortObject(attributes).filter(attribute => attribute[1] > 0);

        // calculate averages for ease of judging a profile
        const ratingAverages = {};
        let overallRating = 0;
        Object.keys(ratings).forEach((key)=>{
          let sum = 0;
          ratings[key].forEach((num) =>{
            sum += num;
          });
          const ratingAverage = sum / ratings[key].length;
          ratingAverages[key] = (ratingAverage).toFixed(1);
          overallRating += ratingAverage;
        });
        data.ratingAverages = ratingAverages;
        data.overallRating = (overallRating / Object.keys(ratings).length).toFixed(1);
      });

      return data;
    }
  }
</script>
