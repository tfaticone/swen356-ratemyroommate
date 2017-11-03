<template>
  <div>
    <span class="md-headline">
      {{ viewedUser.firstName + " " + viewedUser.lastName + " at " + school + " (" + userId + ")" }}
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

    <md-dialog ref="reportForm">
      <form>
        <md-input-container>
          <label>Please explain the reason for the report</label>
          <md-textarea></md-textarea>
        </md-input-container>
      </form>
    </md-dialog>

    <div>
      <span class="md-headline">
        {{ Object.keys(viewedUserReviews).length }} Roommate Ratings
      </span>

      <md-stepper v-on:completed="saveNewReview">
        <md-step :md-disabled="finishedReview" :md-continue="stepOneNewReview">
          <span class="md-display-1">Start a new review</span>
          <md-layout md-column>
            <md-layout md-gutter>
              <md-layout md-gutter md-column md-flex="50">
                <md-layout md-gutter md-align="center">
                  <span class="md-headline">Cleanliness</span>
                  <md-rating-bar :md-icon-size="1" v-model="newReviewCleanliness"></md-rating-bar>
                </md-layout>
              </md-layout>
              <md-layout md-gutter md-column md-flex="50">
                <md-layout md-gutter md-align="center">
                  <span class="md-headline">Loudness</span>
                  <md-rating-bar :md-icon-size="1" md-align="center" v-model="newReviewLoudness"></md-rating-bar>
                </md-layout>
              </md-layout>
            </md-layout>
            <md-layout md-gutter>
              <md-layout md-gutter md-column md-flex="50">
                <md-layout md-gutter md-align="center">
                  <span class="md-headline">Respectfulness</span>
                  <md-rating-bar :md-icon-size="1" v-model="newReviewRespectfulness"></md-rating-bar>
                </md-layout>
              </md-layout>
              <md-layout md-gutter md-column md-flex="50">
                <md-layout md-gutter md-align="center">
                  <span class="md-headline">Sociability</span>
                  <md-rating-bar :md-icon-size="1" md-align="center" v-model="newReviewSociability"></md-rating-bar>
                </md-layout>
              </md-layout>
              <md-layout md-gutter md-column md-align="center">
                <span class="md-headline">Traits (optional)</span>
                <md-input-container>
                  <label for="traits">Select all traits that apply</label>
                  <md-select name="traits" multiple v-model="newReviewTraits">
                    <md-option v-for="(option, index) in globalTraits"
                               :key="index"
                               :value="index">
                      {{ option }}
                    </md-option>
                    </md-select>
                </md-input-container>
              </md-layout>
            </md-layout>
          </md-layout>
        </md-step>
        <md-step :md-disabled="stepOneDisabled" :md-continue="stepTwoNewReview">
          <md-layout md-gutter>
            <md-input-container>
              <md-layout md-gutter md-column md-flex="50" md-flex-offset="25">
                <span class="md-display-1">Additional Comments</span>
                <md-textarea v-model="newReviewAdditionalComments"></md-textarea>
              </md-layout>
            </md-input-container>
          </md-layout>
          <md-layout md-gutter id="successMessage">
            <md-icon class="md-size-2x md-primary">done</md-icon> Review Submitted
          </md-layout>
        </md-step>
      </md-stepper>
      <md-whiteframe md-tag="section" v-for="(rating, ratingId) in viewedUserReviews">
        <span class="md-title"> Date submitted: {{ (new Date(rating.date)).toLocaleDateString("en-US")}} </span><br>
        <span class="md-title" v-for="(value, metric) in rating.metrics">
          {{ globalMetrics[metric].desc }}: {{ value }}
        </span>
        <div> {{ rating.comment }} </div>
        <div><md-button v-on:click.stop.prevent="reportReview(ratingId, school, userId)" class="md-raised md-warn">Report</md-button></div>
      </md-whiteframe>
    </div>
  </div>
</template>

<script>
  import db from '../database';
  import util from '../util/util';
  import AuthMixin from '../mixins/auth'
  import MdInputContainer from "../../node_modules/vue-material/src/components/mdInputContainer/mdInputContainer.vue";
  import MdTextarea from "../../node_modules/vue-material/src/components/mdInputContainer/mdTextarea.vue";

  const metricsRef = db.ref('metrics');
  const traitsRef = db.ref('traits');
  const schoolsRef = db.ref('users');
  const reviewsRef = db.ref('reviews');

  export default {
    components: {
      MdTextarea,
      MdInputContainer},
    name: 'profile',
    mixins: [AuthMixin],
    data() {
      return {
        newReviewTraits: [],
        school: this.$route.params.school,
        userId: this.$route.params.user,
        newReviewCleanliness: undefined,
        newReviewLoudness: undefined,
        newReviewRespectfulness: undefined,
        newReviewSociability: undefined,
        newReviewAdditionalComments: "",
        finishedReview: false,
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
      saveNewReview: function(){
        const review = {
          comment: this.newReviewAdditionalComments,
          metrics: {
            cleanliness: this.newReviewCleanliness,
            loudness: this.newReviewLoudness,
            respectfulness: this.newReviewRespectfulness,
            sociability: this.newReviewSociability,
          },
          rater: this.user.displayName,
          date: new Date().toLocaleString(),
        };
        let newTraits = {};
        this.newReviewTraits.forEach((trait) => {
          if(this.newReviewTraits.includes(trait)){
            newTraits[trait] = true;
          }
        });
        review['traits'] = newTraits;
        const userReviewsRef = reviewsRef.child(this.school).child(this.userId);
        const newReviewsRef = userReviewsRef.push();
        newReviewsRef.set(review);
        this.finishedReview = true;
        document.getElementById('successMessage').style.display = 'block';
      },
      reportReview(ratingId) {
        console.log("REported review");
        console.log(this.viewedUserReviews[ratingId]);
        this.$refs['reportForm'].open();

      },
      openReportForm(ref){
        console.log("called");
        this.$refs[ref].open();
      },
      openReportForm(ref){
        this.$refs[ref].close();
      },
    },
    computed: {
      userStats() {
        const userMetrics = {}; // loudness, politeness, etc.
        const userTraits = {}; // smokes, has pet, etc.
        Object.keys(this.viewedUserReviews).forEach((ratingId) => {
          const rating = this.viewedUserReviews[ratingId];

          if(rating !== this.$route.params.user) {

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
      stepOneNewReview: function() {
        return !!this.newReviewCleanliness && !!this.newReviewLoudness && !!this.newReviewRespectfulness && !!this.newReviewSociability
      },
      stepOneDisabled: function() {
        return this.finishedReview || !this.stepOneNewReview;
      },
      stepTwoNewReview: function() {
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
