<template>
  <md-dialog ref="dialog">
    <md-dialog-title>{{title}}</md-dialog-title>
    <md-dialog-content>{{content}}</md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary" @click="close()">Ok</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
  export default {
    data() {
      return {
        title: '',
        content: ''
      }
    },
    methods: {
      // TODO: Custom Buttons
      show(title, content) {
        this.title = title
        this.content = content

        this.$refs['dialog'].open()
      },
      close() {
        this.$refs['dialog'].close()
      }
    }
  }
</script>
