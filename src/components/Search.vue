<template>
  <md-layout md-gutter>
    <md-layout md-column>
      <form novalidate @submit.stop.prevent="login">
        <md-input-container>
          <label for="schoolDropdown">Select school</label>
          <md-select name="schoolDropdown" id="schoolDropdown" v-model="selectedSchool">
            <md-option v-for="school in schools">
              {{ school.shortName }}
            </md-option>
          </md-select>
        </md-input-container>
        <md-input-container>
          <label>Search</label>
          <md-input v-model="searchString" required></md-input>
        </md-input-container>
      </form>
    </md-layout>
  </md-layout>
</template>

<script>
  import db from '../database';

  //  import ErrorDialog from '../partials/Dialog';
  //  import MdSelect from "../../node_modules/vue-material/src/components/mdSelect/mdSelect.vue";
  //  import MdOption from "../../node_modules/vue-material/src/components/mdSelect/mdOption.vue";
  //  import MdList from "../../node_modules/vue-material/src/components/mdList/mdList.vue";
  //  import MdListItem from "../../node_modules/vue-material/src/components/mdList/mdListItemButton.vue";

  const schoolsRef = db.ref('schools');

  export default {
    name: 'search',
//    components: {
//      MdListItem,
//      MdList,
//      MdOption,
//      ErrorDialog
//    },
    data() {
      return {
        searchString: '',
        selectedSchool: undefined,
      };
    },
    firebase: function() {
      return {
        schools: schoolsRef,
      }
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
