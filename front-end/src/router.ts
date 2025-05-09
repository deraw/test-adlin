import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'roomList',
      component: () => import('@/views/RoomList.vue')
    }
  ]
})
