<template>
  <div>

    <!-- Headline displaying the Avatar and basic user info -->
    <span class="md-headline">
      <md-avatar class="md-primary md-avatar-icon md-large">
        <md-icon>face</md-icon>
      </md-avatar>
      {{viewedUser.firstName}} {{viewedUser.lastName}} @ {{school.name}}
    </span>


    <!-- dialog containing the new review form -->
    <md-dialog ref="reviewDialog">
      <md-dialog-title>New Review</md-dialog-title>
      <md-dialog-content>
        <rate-roommate :school="school" :reviewedUser="userId"/>
      </md-dialog-content>
    </md-dialog>

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

  const usersRef   = db.ref('users')
  const schoolsRef = db.ref('schools')
  const reviewsRef = db.ref('reviews')

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
      }
    },
    computed: {

    },
  }
</script>

<style scoped>

</style>
