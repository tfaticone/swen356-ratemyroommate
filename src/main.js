// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import 'vue-material/dist/vue-material.css';

Vue.config.productionTip = false;

import VueFire from 'vuefire';
Vue.use(VueFire);

import VueMaterial from 'vue-material';
Vue.use(VueMaterial);

import VueFuse from 'vue-fuse';
Vue.use(VueFuse);

Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'red',
  warn: 'red',
  background: 'white',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
