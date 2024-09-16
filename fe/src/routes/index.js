import { createMemoryHistory, createRouter } from 'vue-router'

import Auth from '../pages/Auth.vue';
import Inbox from '../pages/Inbox.vue';
import Layout from '../pages/Layout.vue';

const routes = [
  { path: '/login', name: 'Login', component: Auth },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },     
    children: [
      {
        path: '/',          
        name: 'Inbox',
        component: Inbox,
      },
    ]
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('access_token');

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router