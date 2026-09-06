import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/abyss',
      name: 'abyss',
      component: () => import('../views/AbyssView.vue'),
    },
    {
      path: '/story/:section',
      name: 'story',
      component: () => import('../views/StoryView.vue'),
    },
    {
      path: '/whitelist',
      name: 'whitelist',
      component: () => import('../views/WhitelistView.vue'),
    },
  ],
})

export default router