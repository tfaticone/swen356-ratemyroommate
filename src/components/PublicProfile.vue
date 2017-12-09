<template>
  <div>

    <!-- Headline displaying the Avatar and basic user info -->
    <span class="md-headline">
      <md-avatar class="md-primary md-avatar-icon md-large">
        <md-icon>face</md-icon>
      </md-avatar>
      {{viewedUser.firstName}} {{viewedUser.lastName}} @ {{school.name}}
    </span>

    <!-- Display average ratings -->
    <md-layout md-row>
      <md-layout md-column>
        <span class="md-headline">Overall Rating</span>
        <md-rating-bar disabled :md-icon-size="1" v-model="globalAverage"></md-rating-bar>
      </md-layout>

      <md-layout md-column>
        <span class="md-headline">Cleanliness</span>
        <md-rating-bar disabled :md-icon-size="1" v-model="averageCleanliness"></md-rating-bar>
      </md-layout>

      <md-layout md-column>
        <span class="md-headline">Quietness</span>
        <md-rating-bar disabled :md-icon-size="1" v-model="averageQuietness"></md-rating-bar>
      </md-layout>

      <md-layout md-column>
        <span class="md-headline">Respectfulness</span>
        <md-rating-bar disabled :md-icon-size="1" v-model="averageRespectfulness"></md-rating-bar>
      </md-layout>

      <md-layout md-column>
        <span class="md-headline">Sociability</span>
        <md-rating-bar disabled :md-icon-size="1" v-model="averageSociability"></md-rating-bar>
      </md-layout>
    </md-layout>

    <!-- dialog containing the new review form -->
    <md-dialog ref="reviewDialog">
      <md-dialog-title>New Review</md-dialog-title>
      <md-dialog-content>
        <rate-roommate :school="school.domain" :reviewedUser="userId"/>
      </md-dialog-content>
    </md-dialog>

    <!-- Report popup -->
    <md-dialog ref="reportForm">
      <md-dialog-title>Please explain the reason for the report</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <md-textarea v-model="newReport.description" required maxlength='250'></md-textarea>
        </md-input-container>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-warn" @click="submitReport(true)">Submit Report</md-button>
        <md-button class="md-primary" @click="closeReportForm('reportForm');">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog-alert
      :md-content="alert.content"
      :md-ok-text="alert.ok"
      ref="submittedReport">
    </md-dialog-alert>

    <!-- Comment popup -->
    <md-dialog ref="commentForm">
      <md-dialog-title>Please type a response to the review</md-dialog-title>
      <md-dialog-content>
        <md-input-container>
          <md-textarea v-model="newComment.comment" required maxlength='500'></md-textarea>
        </md-input-container>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-warn" @click="submitComment(true)">Submit Comment</md-button>
        <md-button class="md-primary" @click="closeCommentForm('commentForm');">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Cards to display individual reviews -->
    <md-card v-for="review in reviews" :key="review['.key']">
      <md-card-header>{{review.rater}}</md-card-header>
      <md-card-content>
        <md-layout md-column>
          <md-layout md-row>
            <md-layout md-column>
              <span class="md-headline">Cleanliness</span>
              <md-rating-bar disabled :md-icon-size="1" v-model="review.metrics.cleanliness"></md-rating-bar>

              <span class="md-headline">Quietness</span>
              <md-rating-bar disabled :md-icon-size="1" v-model="review.metrics.quietness"></md-rating-bar>

              <span class="md-headline">Respectfulness</span>
              <md-rating-bar disabled :md-icon-size="1" v-model="review.metrics.respectfulness"></md-rating-bar>

              <span class="md-headline">Sociability</span>
              <md-rating-bar disabled :md-icon-size="1" v-model="review.metrics.sociability"></md-rating-bar>
            </md-layout>
            <md-layout md-column>
              {{review.comment}}
            </md-layout>
          </md-layout>
          <md-chip v-for="trait in review.traits">
            {{trait}}
          </md-chip>
        </md-layout>
      </md-card-content>
      <md-card-content v-if="review.response" class="response">
        <b>Response:</b><br>
        {{review.response}}
      </md-card-content>
      <md-card-actions>
        <md-button v-on:click.stop.prevent="reportReview(review['.key'])" class="md-raised md-warn">Report</md-button>
        <md-button v-if="isViewingOwnProfile" v-on:click.stop.prevent="commentOnReview(review['.key'])" class="md-raised md-warn">Comment</md-button>
      </md-card-actions>
    </md-card>

    <!-- Bottom-right FAB to open the review dialog -->
    <md-button class="md-fab md-primary md-fab-bottom-right" @click.native="openReviewDialog()">
      <md-icon>edit</md-icon>
    </md-button>

  </div>
</template>

<script>
  import db from '../database';
  import util from '../util/util';
  import AuthMixin from '../mixins/auth'
  import RateRoommate from './RateRoommate'

  const usersRef   = db.ref('users');
  const schoolsRef = db.ref('schools');
  const reviewsRef = db.ref('reviews');
  const openReportsRef = db.ref('openReports');

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
        newReport: {},
        newComment: {},
        alert: {
          content: "Thank you. Your report has been submitted.",
          ok: "Ok"
        },
      };
    },
    firebase() {
      return {
        reviews: reviewsRef
                    .child(this.school)
                    .child(this.userId),

        school: {
          source: schoolsRef
                    .child(this.school),
          asObject: true,
        },

        viewedUser: {
          source: usersRef
                    .child(this.school)
                    .child(this.userId),
          asObject: true,
        },
      }
    },
    methods: {
      openReviewDialog() {
        this.$refs['reviewDialog'].open()
      },
      reportReview(ratingId) {
        this.openReportForm('reportForm');
        this.newReport.date = new Date().toLocaleString();
        this.newReport.reporter = this.user.uid;
        this.newReport.school = this.school;
        this.newReport.reviewKey = ratingId;
        this.newReport.user = this.userId;
        this.newReport.reporterDisplayName = this.user.displayName;
      },
      openReportForm(ref){
        this.$refs[ref].open();
      },
      closeReportForm(ref){
        this.$refs[ref].close();
      },
      submitReport(closeModal) {
        openReportsRef.child('reviews').push().set(this.newReport);
        this.openReportForm('submittedReport');
        this.newReport = {};

        if (closeModal) {
          this.closeReportForm('reportForm');
        }
      },
      commentOnReview(ratingId) {
        this.openCommentForm('commentForm');
        this.newComment = {};
        this.newComment.ratingId = ratingId;
      },
      openCommentForm(ref){
        this.$refs[ref].open();
      },
      closeCommentForm(ref){
        this.$refs[ref].close();
      },
      submitComment(closeModal) {
        let review = reviewsRef.child(this.school['.key']).child(this.userId).child(this.newComment.ratingId);
        this.newComment = {
          response: this.newComment.comment,
        };
        review.update(this.newComment);
        if (closeModal) {
          this.closeCommentForm('commentForm');
        }
      },
      $_collectValuesFromReviews(reviews, metric) {
        return reviews.map(review => review.metrics[metric])
      },
      $_averageOf(values) {
        return values.reduce((previous, current) => {
          return current += previous
        }, 0) / values.length
      }
    },
    computed: {
      averageCleanliness() {
        return this.$_averageOf(this.$_collectValuesFromReviews(this.reviews, 'cleanliness'))
      },
      averageQuietness() {
        return this.$_averageOf(this.$_collectValuesFromReviews(this.reviews, 'quietness'))
      },
      averageRespectfulness() {
        return this.$_averageOf(this.$_collectValuesFromReviews(this.reviews, 'respectfulness'))
      },
      averageSociability() {
        return this.$_averageOf(this.$_collectValuesFromReviews(this.reviews, 'sociability'))
      },
      globalAverage() {
        return this.$_averageOf(
          this.$_collectValuesFromReviews(this.reviews, 'cleanliness')
            .concat(this.$_collectValuesFromReviews(this.reviews, 'quietness'))
            .concat(this.$_collectValuesFromReviews(this.reviews, 'respectfulness'))
            .concat(this.$_collectValuesFromReviews(this.reviews, 'sociability'))
        )
      },
      isViewingOwnProfile(){
        return (this.viewedUser.firstName + " " + this.viewedUser.lastName) === this.user.displayName
      },
    },
  }
</script>

<style scoped>
  .response {
    background-color: #a5d6a7;
    border: 1px solid #66bb6a;
    margin: 0.5rem 1rem;
    border-radius: 10px;
  }
</style>
