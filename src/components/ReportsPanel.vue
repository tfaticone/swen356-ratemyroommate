<template>
    <md-layout md-column>
      <span class="md-headline">
        Reports Panel
      </span>
      <span class="md-title">
        Reviews
      </span>


      <md-card v-for="(report, reportId) in globalReviewReports">
        <md-card-expand>
          <md-layout>
            <md-layout>
              <md-card-actions>
                <span class="md-subheader">Report by {{ report.reporterDisplayName }}</span>
                <md-button class="md-icon-button" md-expand-trigger>
                  <md-icon>keyboard_arrow_down</md-icon>
                </md-button>
              </md-card-actions>
            </md-layout>
            <md-layout md-align="end">
              <md-card-actions :md-align="end">
                <md-button class="md-raised md-primary" v-on:click.prevent.stop="acceptReport(report['.key'], report.school, report.user, report.reviewKey)">Accept</md-button>
                <md-button class="md-raised" v-on:click.prevent.stop="rejectReport(report['.key'])">Reject</md-button>
              </md-card-actions>
            </md-layout>
          </md-layout>
          <md-card-content>
            <div class="md-body-2">Reported Review Information</div>
            <div>Cleanliness: {{ globalReviews[report.school][report.user][report.reviewKey]['metrics']['cleanliness'] }}</div>
            <div>Loudness: {{ globalReviews[report.school][report.user][report.reviewKey]['metrics']['loudness'] }}</div>
            <div>Respectfulness: {{ globalReviews[report.school][report.user][report.reviewKey]['metrics']['respectfulness'] }}</div>
            <div>Sociability: {{ globalReviews[report.school][report.user][report.reviewKey]['metrics']['sociability'] }}</div>
            <div>Description: {{ globalReviews[report.school][report.user][report.reviewKey]['comment'] }}</div>
            <div>Traits:
              <span v-for="(trait, traitID) in globalReviews[report.school][report.user][report.reviewKey]['traits']">
                {{ globalTraits[traitID] }},
              </span>
            </div>
            <div class="md-body-2">Report Description</div>
            <div>{{ report.description }}</div>
          </md-card-content>
        </md-card-expand>
      </md-card>


    </md-layout>
</template>

<script>
  import Firebase from 'firebase'

  import ErrorDialog from '../partials/Dialog'
  import db from '../database';
  import MdCardContent from "../../node_modules/vue-material/src/components/mdCard/mdCardContent.vue";
  import MdCardHeader from "../../node_modules/vue-material/src/components/mdCard/mdCardHeader.vue";
  import MdCardActions from "../../node_modules/vue-material/src/components/mdCard/mdCardActions.vue";

  const openReportsRef = db.ref('openReports');
  const closedReportsRef = db.ref('closedReports');
  const reviewsRef = db.ref('reviews');
  const traitsRef = db.ref('traits');

  export default {
    name: 'register',
    components: {
      MdCardActions,
      MdCardHeader,
      MdCardContent,
      ErrorDialog
    },
    data () {
      return {
      };
    },
    firebase() {
      return {
        globalReviewReports: {
          source: openReportsRef.child('reviews'),
          asObject: false
        },
        globalReviews: {
          source: reviewsRef,
          asObject: true
        },
        globalTraits: {
          source: traitsRef,
          asObject: true
        }
      }
    },
    methods: {
      acceptReport: function(reportId, school, user, reviewId){
        reviewsRef.child(school).child(user).child(reviewId).remove();
        openReportsRef.child('reviews').child(reportId).once('value', function(snapshot) {
          let value = snapshot.val();
          value.result = "Accepted";
          closedReportsRef.child(reportId).set(value);
          openReportsRef.child('reviews').child(reportId).remove();
        });
      },
      rejectReport: function(reportId){
        openReportsRef.child('reviews').child(reportId).once('value', function(snapshot) {
          let value = snapshot.val();
          value.result = "Rejected";
          closedReportsRef.child(reportId).set(value);
          openReportsRef.child('reviews').child(reportId).remove();
        });
      }
    },
    calculated: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
