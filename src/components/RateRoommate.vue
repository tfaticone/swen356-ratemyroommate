<template>
  <md-layout md-column>
    <span class="md-headline">Cleanliness</span>
    <md-rating-bar :md-icon-size="1" v-model="cleanliness"></md-rating-bar>

    <span class="md-headline">Quietness</span>
    <md-rating-bar :md-icon-size="1" v-model="quietness"></md-rating-bar>

    <span class="md-headline">Respectfulness</span>
    <md-rating-bar :md-icon-size="1" v-model="respectfulness"></md-rating-bar>

    <span class="md-headline">Sociability</span>
    <md-rating-bar :md-icon-size="1" v-model="sociability"></md-rating-bar>

    <span class="md-headline"></span>
    <md-input-container>
      <label>Select all traits that apply</label>
      <md-select multiple v-model="traits">
        <md-option v-for="(option, index) in allTraits" :key="index" :value="option">
          {{option}}
        </md-option>
      </md-select>
    </md-input-container>

    <span class="md-headline">Additional Comments</span>
    <md-input-container>
      <md-textarea v-model="additionalComments"></md-textarea>
    </md-input-container>

    <md-button
      class="md-raised md-primary"
      @click.native="submitReview()">
      Submit
    </md-button>
  </md-layout>
</template>

<script>
  import db from '../database';
  import AuthMixin from '../mixins/auth'

  const reviewsRef = db.ref('reviews')
  const traitsRef  = db.ref('traits')

  export default {
    props: ['school', 'reviewedUser'],
    mixins: [AuthMixin],
    data() {
      return {
        cleanliness: 0,
        quietness: 0,
        respectfulness: 0,
        sociability: 0,
        additionalComments: '',
        traits: []
      }
    },
    firebase: {
      allTraits: {
        source: traitsRef,
        asObject: true
      }
    },
    methods: {
      submitReview() {
        reviewsRef
          .child(this.school)
          .child(this.reviewedUser)
          .push({
            rater: this.user.displayName,
            raterId: this.user.uid,
            date: new Date().toLocaleString(),
            metrics: {
              cleanliness: this.cleanliness,
              quietness: this.quietness,
              respectfulness: this.respectfulness,
              sociability: this.sociability
            },
            traits: this.traits,
            comment: this.additionalComments
          })
      }
    }
  }
</script>

<style scoped>

</style>
