<template>
  <md-layout md-gutter>
    <md-layout md-column>
      <form novalidate @submit.stop.prevent="login">
        <md-input-container>
          <label for="school">Select school</label>
          <md-select name="school" id="school" v-model="school">
            <md-option value="rit">Rochester Institute of Technology</md-option>
            <md-option value="uor">University of Rochester</md-option>
            <md-option value="mcc">Monroe Community College</md-option>
          </md-select>
        </md-input-container>
        <md-input-container>
          <label>Search</label>
          <md-input v-model="searchString" required></md-input>
        </md-input-container>
      </form>
      <span class="md-title"> test </span>
      <md-list v-for="student in students" :key="students.student">
        <span class="md-title"> {{student.firstName }} </span>
      </md-list>
    </md-layout>
  </md-layout>
</template>

<script>
  import db from '../database'

  import ErrorDialog from '../partials/Dialog'
  import MdSelect from "../../node_modules/vue-material/src/components/mdSelect/mdSelect.vue";
  import MdOption from "../../node_modules/vue-material/src/components/mdSelect/mdOption.vue";
  import MdList from "../../node_modules/vue-material/src/components/mdList/mdList.vue";
  import MdListItem from "../../node_modules/vue-material/src/components/mdList/mdListItemButton.vue";

  let studentsRef = db.ref("schools/rit");


  export default {
    name: 'search',
    components: {
      MdListItem,
      MdList,
      MdOption,
      ErrorDialog
    },
    data () {
      let studentsData = {};

      studentsRef.on('value', (studentsSnap) => {
        studentsData = studentsSnap.value();
    });

      return {
        searchString: '',
        students: studentsData,
      }

    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
