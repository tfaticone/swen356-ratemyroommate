<template>
  <md-layout md-column>
    <span class="md-headline">Cleanliness</span>
    <md-rating-bar :md-icon-size="1" v-model="cleanliness"></md-rating-bar>

    <span class="md-headline">Loudness</span>
    <md-rating-bar :md-icon-size="1" v-model="loudness"></md-rating-bar>

    <span class="md-headline">Respectfulness</span>
    <md-rating-bar :md-icon-size="1" v-model="respectfulness"></md-rating-bar>

    <span class="md-headline">Sociability</span>
    <md-rating-bar :md-icon-size="1" v-model="sociability"></md-rating-bar>

    <span class="md-headline"></span>
    <md-input-container>
      <label>Select all traits that apply</label>
      <md-select multiple name="traits" v-model="traits">
        <md-option v-for="(option, index) in allTraits" :key="index" :value="index">
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

  const reviewsRef = db.ref('reviews');

  export default {
    props: ['school', 'user'],
    mixins: [AuthMixin],
    data() {
      return {
        cleanliness: null,
        loudness: null,
        respectfulness: null,
        sociability: null,
      }
    },
    methods: {
      submitReview() {
        reviewsRef
          .child(this.school)
          .child(this.user)
          .push({
            comment: null,
            rater: this.user.displayName,
            date: new Date().toLocaleString(),
            metrics: {
              cleanliness: null,
              loudness: null,
              respectfulness: null,
              sociability: null
            },
            traits: {
              // TODO
            }
          })
      }
    }
  }
</script>

<style scoped>

</style>
