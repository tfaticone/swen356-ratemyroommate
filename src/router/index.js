import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Register from '@/components/Register';
import PublicProfile from '@/components/PublicProfile';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/schools/:school/users/:user',
      name: 'Public Profile',
      component: PublicProfile
    }
  ]
});
