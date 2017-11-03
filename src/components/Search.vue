<template>
  <md-layout md-gutter>
    <md-layout md-column>
      <div class="field-group">

        <md-input-container>
          <md-select name="schoolDropdown" id="schoolDropdown" v-model="selectedSchool">
            <md-option :value=school.domain v-for="school in schools">
              {{ school.name }}
            </md-option>
          </md-select>
        </md-input-container>

        <md-input-container>
          <label>Search</label>
          <md-input v-model="searchString" required></md-input>
        </md-input-container>
      </div>

      <md-list name="searchResults" id="searchResults" v-model="searchResults" class="md-double-line">
        <md-list-item :value=searchResult.domain v-for="searchResult in searchResults">

          <div class="md-list-text-container">
            <span>{{ searchResult.fullName }}</span>
            <span>{{ searchResult.username }}</span>
          </div>

          <div>
            {{ 'Rating: ' + searchResult.overallRating }}
          </div>

          <md-divider class="md-inset"></md-divider>
          <!--{{ searchResult.fullName }}-->
        </md-list-item>
      </md-list>

      <!--{{ searchResults }}-->



    </md-layout>
  </md-layout>
</template>

<script>
  import db from '../database';
  import MdInputContainer from "../../node_modules/vue-material/src/components/mdInputContainer/mdInputContainer.vue";
  import MdSelect from "../../node_modules/vue-material/src/components/mdSelect/mdSelect.vue";
  import MdOption from "../../node_modules/vue-material/src/components/mdSelect/mdOption.vue";

  const schoolsRef = db.ref('schools');
  const usersRef = db.ref('users');

  const fuseSearchOptions = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "username",
      "fullName",
    ],
  };

  export default {
    name: 'search',
    components: {
      MdInputContainer,
      MdSelect,
      MdOption,
    },
    data() {
      return {
        searchString: undefined,
        selectedSchool: undefined,
        searchResults: undefined,
      };
    },
    firebase: function() {
      return {
        schools: schoolsRef,
        users: {
          source: usersRef,
          asObject: true,
        },
      }
    },
    computed: {

    },
    watch: {
      searchString() {
        this.search();
      }
    },
    methods: {
      search() {
        const school = this.users[this.selectedSchool];

        if (Object.keys(school).length > 0) {

          const users = Object.keys(school).map((userId) => {
            const user = school[userId];
            user.fullName = `${user.firstName} ${user.lastName}`;
            return user;
          });

          this.$search(this.searchString, users, fuseSearchOptions).then((results) => {
            this.searchResults = results;
          });
        }
      }
    },
  }
</script>

<style scoped>

</style>
