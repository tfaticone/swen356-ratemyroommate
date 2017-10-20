<template>
  <div>
    <span class="md-headline">
      {{ user.firstName + " " + user.lastName + " at " + school + " (" + userId + ")" }}
    </span>

    <md-button class="md-raised md-primary">Rate This Roommate</md-button>

    <div>
      <span class="md-display-2"> Overall: {{ userStats.overallRating }} </span>
      <md-rating-bar v-model="userStats.overallRating" :md-max-rating=5 class="md-primary" :md-empty-icon="'star_border'" disabled></md-rating-bar>
    </div>

    <md-list class="md-dense">
      <md-list-item v-for="(value, metric) in userStats.metrics">
        <div>
          <span class="md-title">{{ globalMetrics[metric].desc }}: {{ value }}</span>
        </div>
      </md-list-item>
    </md-list>

    <md-chip disabled v-for="trait in userStats.traits">
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
        <div> {{ rating.comment }} </div>
      </md-whiteframe>
    </div>
  </div>
</template>

<script>
  import db from '../database';
  import util from '../util/util';

  const metricsRef = db.ref('metrics');
  const traitsRef = db.ref('traits');
  const schoolsRef = db.ref('schools');

  export default {
    name: 'profile',
    data() {
      return {
        school: this.$route.params.school,
        userId: this.$route.params.user,
      };
    },
    firebase() {
      return {
        globalMetrics: {
          source: metricsRef,
          asObject: true,
        },
        globalTraits: {
          source: traitsRef,
          asObject: true,
        },
        user: {
          source: schoolsRef.child(this.school).child(this.userId),
          asObject: true,
        },
      }
    },
    computed: {
      userStats() {
        const userMetrics = {}; // loudness, politeness, etc.
        const userTraits = {}; // smokes, has pet, etc.
        Object.keys(this.user.ratings).forEach((ratingId) => {
          const rating = this.user.ratings[ratingId];

          // tally traits
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

          // tally metrics
          Object.keys(rating.metrics).forEach((key) => {
            if (!userMetrics[key]) {
              userMetrics[key] = [];
            }
            userMetrics[key].push(rating.metrics[key]);
          });
        });

        // calculate metric averages and overall rating
        const metricAverages = {};
        let overallRating = 0;
        Object.keys(userMetrics).forEach((key) => {
          let sum = 0;
          userMetrics[key].forEach((num) => {
            sum += num;
          });
          const ratingAverage = sum / userMetrics[key].length;
          metricAverages[key] = (ratingAverage).toFixed(1);
          overallRating += (this.globalMetrics[key].inverted ? 6 - ratingAverage : ratingAverage);
        });

        return {
          traits: util.sortObject(userTraits).filter(trait => trait[1] > 0),
          metrics: metricAverages,
          overallRating: (overallRating / Object.keys(userMetrics).length).toFixed(1),
        };
      },
    },
  }
</script>
