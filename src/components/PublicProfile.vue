<template>
  <div>

    <span class="md-headline">
      {{ user.firstName + " " + user.lastName + " at " + school + " (" + userId + ")" }}
    </span>

    <md-button class="md-raised md-primary">Rate This Roommate</md-button>

    <div>
      <span class="md-display-2">
        Overall: {{ overallRating }}
      </span>
      <md-rating-bar v-model="overallRating" :md-max-rating=5 class="md-primary" :md-empty-icon="'star_border'" disabled></md-rating-bar>
    </div>


    <md-list class="md-dense">
      <md-list-item v-for="(value, metric) in userMetrics">
        <div>
          <span class="md-title">{{ globalMetrics[metric].desc }}: {{ value }}</span>
        </div>
      </md-list-item>
    </md-list>

    <md-chip disabled v-for="trait in userTraits">
      {{ globalTraits[trait[0]] }}: +{{ trait[1] }}
    </md-chip>

    <div>
      <span class="md-headline">
        {{ Object.keys(user.ratings).length }} Roommate Ratings
      </span>
      <md-whiteframe md-tag="section" v-for="(rating, ratingId) in user.ratings">
        <span class="md-title"> Date submitted: {{ (new Date(rating.date)).toLocaleDateString("en-US") }} </span><br>
        <span class="md-title" v-for="(value, metric) in rating.metrics">
          {{ globalMetrics[metric].desc }}: {{ value }}
        </span>
        <div>
          {{ rating.comment }}
        </div>
      </md-whiteframe md-tag="section">
    </div>
  </div>
</template>

<script>
  import db from '../database';
  import util from '../util/util';

  export default {
    name: 'profile',
    data() {
      const data = {
        school: this.$route.params.school,
        userId: this.$route.params.user,
        user: {},
        overallRating: 0,
        userTraits: {},
        userMetrics: {},
        globalTraits: {},
        globalMetrics: {},
      };

      const metricsRef = db.ref('metrics');
      metricsRef.on('value', (metricsSnap) => {
        const globalMetrics = metricsSnap.val();
        data.globalMetrics = globalMetrics;

        const traitsRef = db.ref('traits');
        traitsRef.on('value', (traitsSnap) => {
          const globalTraits = traitsSnap.val();
          data.globalTraits = globalTraits;

          const userRef = db.ref(`schools/${this.$route.params.school}/${this.$route.params.user}`);
          userRef.on('value', (userSnap) => {
            data.user = userSnap.val();

            // tally up metrics and traits
            const userTraits = {}; // smokes, has pet, etc.
            const userMetrics = {}; // loudness, politeness, etc.
            Object.keys(data.user.ratings).forEach((ratingId) => {
              const rating = data.user.ratings[ratingId];

              // userTraits
              Object.keys(rating.traits).forEach((trait) => {
                if (!userTraits[trait]) {
                  userTraits[trait] = 0
                }
                if (rating.traits[trait] === true) {
                  userTraits[trait] += 1;
                } else {
                  userTraits[trait] -= 1;
                }
              });

              // userMetrics
              Object.keys(rating.metrics).forEach((key) => {
                if (!userMetrics[key]) {
                  userMetrics[key] = [];
                }
                userMetrics[key].push(rating.metrics[key]);
              });
            });
            data.userTraits = util.sortObject(userTraits)
              .filter(trait => trait[1] > 0);



            // calculate averages for ease of judging a profile
            const metricAverages = {};
            let overallRating = 0;
            Object.keys(userMetrics).forEach((key) => {
              let sum = 0;
              userMetrics[key].forEach((num) =>{
                sum += num;
              });
              const ratingAverage = sum / userMetrics[key].length;
              metricAverages[key] = (ratingAverage).toFixed(1);
              overallRating += (globalMetrics[key].inverted ? 6 - ratingAverage : ratingAverage);
            });

            data.userMetrics = metricAverages;
            data.overallRating = (overallRating / Object.keys(userMetrics).length).toFixed(1);
          });
        });
      });

      return data;
    },
  }
</script>
