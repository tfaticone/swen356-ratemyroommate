<template>
  <div>
    <span class="md-headline">
      {{ viewedUser.firstName + " " + viewedUser.lastName + " at " + school + " (" + userId + ")" }}
    </span>

    <md-button class="md-raised md-primary" @click.native="openReviewDialog()">Rate This Roommate</md-button>

    <div>
      <span class="md-display-2"> Overall: {{ userStats.overallRating }} </span>
      <md-rating-bar v-model="userStats.overallRating" :md-max-rating="5" class="md-primary"
                     :md-empty-icon="'star_border'" disabled></md-rating-bar>
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
        {{ Object.keys(viewedUserReviews).length }} Roommate Ratings
      </span>

      <md-dialog ref="reviewDialog">
        <md-dialog-title>New Review</md-dialog-title>
        <md-dialog-content>
          <rate-roommate
            :school="school"
            :reviewedUser="userId"
          ></rate-roommate>
        </md-dialog-content>
      </md-dialog>

      <md-whiteframe md-tag="section" v-for="(rating, ratingId) in viewedUserReviews">
        <span class="md-title"> Date submitted: {{ (new Date(rating.date)).toLocaleDateString("en-US")}} </span><br>
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
  import AuthMixin from '../mixins/auth'
  import RateRoommate from './RateRoommate'

  const metricsRef = db.ref('metrics');
  const traitsRef = db.ref('traits');
  const schoolsRef = db.ref('users');
  const reviewsRef = db.ref('reviews');

  export default {
    name: 'profile',
    mixins: [AuthMixin],
    components: {
      RateRoommate
    },
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
        viewedUser: {
          source: schoolsRef.child(this.school).child(this.userId),
          asObject: true,
        },
        viewedUserReviews: {
          source: reviewsRef.child(this.school).child(this.userId),
          asObject: false,
        },
      }
    },
    methods: {
      openReviewDialog() {
        this.$refs['reviewDialog'].open()
      }
    },
    computed: {
      userStats() {
        const userMetrics = {}; // loudness, politeness, etc.
        const userTraits = {}; // smokes, has pet, etc.
        Object.keys(this.viewedUserReviews).forEach((ratingId) => {
          const rating = this.viewedUserReviews[ratingId];

          if (rating !== this.$route.params.user) {

            // tally traits
            if (!!rating && !!rating.traits) {
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
            }


            // tally metrics
            if (!!rating && !!rating.metrics) {
              Object.keys(rating.metrics).forEach((key) => {
                if (!userMetrics[key]) {
                  userMetrics[key] = [];
                }
                userMetrics[key].push(rating.metrics[key]);
              });
            }
          }
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

        let userMetricLength = (Object.keys(userMetrics).length != 0) ? Object.keys(userMetrics).length : 1;
        return {
          traits: util.sortObject(userTraits).filter(trait => trait[1] > 0),
          metrics: metricAverages,
          overallRating: (overallRating / userMetricLength).toFixed(1),
        };
      },
      stepOneNewReview: function () {
        return !!this.newReviewCleanliness && !!this.newReviewLoudness && !!this.newReviewRespectfulness && !!this.newReviewSociability
      },
      stepOneDisabled: function () {
        return this.finishedReview || !this.stepOneNewReview;
      },
      stepTwoNewReview: function () {
        return !!this.newReviewAdditionalComments && !this.stepOneDisabled;
      },
    },
  }
</script>

<style scoped>
  #successMessage {
    display: none;
  }
</style>
