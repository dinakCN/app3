/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'


// export const routes = [{
//   path: '/',
//   name: 'main',
//   component: () => import('@/pages/index.vue'),
//   meta: {
//     layout: 'default',
//     auth: true
//   }
// },
// {
//   path: '/cargo',
//   name: 'cargo',
//   props: false,
//   // component: () => import('@/pages/cargo/Cargo.vue'),
//   meta: {
//     layout: 'project',
//     auth: true
//   }
// },
// {
//   path: '/cargo/imports/:clid?',
//   name: 'imports',
//   props: true,
//   // component: () => import('@/pages/cargo/Import.vue'),
//   meta: {
//     layout: 'project',
//     auth: true
//   }
// },
// {
//   path: '/cargo/item/:clid/:id?',
//   name: 'item',
//   props: true,
//   // component: () => import('@/pages/cargo/Item.vue'),
//   meta: {
//     layout: 'project',
//     auth: true
//   }
// },
// {
//   path: '/load',
//   name: 'load',
//   props: false,
//   // component: () => import('@/pages/cargo/Load.vue'),
//   meta: {
//     layout: 'project',
//     auth: true
//   }
// },
// {
//   path: '/load/area/:id?',
//   name: 'area',
//   props: true,
//   // component: () => import('@/pages/cargo/Area.vue'),
//   meta: {
//     layout: 'project',
//     auth: true
//   }
// },
// {
//   path: '/scene',
//   name: 'scene',
//   props: false,
//   // component: () => import('@/pages/cargo/Scene.vue'),
//   meta: {
//     layout: 'project',
//     auth: true
//   }
// },
// {
//   path: '/share/:project_/:id_',
//   name: 'share',
//   props: true,
//   // component: () => import('@/pages/cargo/Scene.vue'),
//   meta: {
//     layout: 'shared',
//     auth: false
//   }
// },
// {
//   path: '/user',
//   name: 'user',
//   props: false,
//   // component: () => import(/* webpackPrefetch: true */'@/pages/common/User.vue'),
//   meta: {
//     layout: 'project',
//     auth: true
//   }
// },
// {
//   path: '/brief',
//   name: 'brief',
//   props: false,
//   // component: () => import(/* webpackPrefetch: true */'@/pages/common/Brief.vue'),
//   meta: {
//     layout: 'project',
//     auth: false
//   }
// },
// {
//   path: '/exit',
//   name: 'exit',
//   meta: {
//     redirect: 'https://app.jload.me/exit?service=logout'
//   }
// },
// {
//   path: '/support',
//   name: 'support',
//   meta: {
//     redirect: 'https://app.jload.me/send'
//   }
// },
// {
//   path: '/blog',
//   name: 'blog',
//   meta: {
//     redirect: 'https://app.jload.me/blogs/cases/'
//   }
// },
// {
//   path: '/terms',
//   name: 'terms',
//   meta: {
//     redirect: 'https://app.jload.me/terms/terms'
//   }
// },
// {
//   path: '/func',
//   name: 'func',
//   meta: {
//     redirect: 'https://app.jload.me/terms/function'
//   }
// },
// {
//   path: '/offer',
//   name: 'offer',
//   meta: {
//     redirect: 'https://app.jload.me/offer'
//   }
// },
// {
//   path: '/versions',
//   name: 'versions',
//   meta: {
//     redirect: 'https://app.jload.me/my'
//   }
// },
// {
//   path: '*',
//   name: 'error',
//   // component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
//   meta: {
//     layout: 'error'
//   }
// }]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // routes,
  extendRoutes: setupLayouts,
})

export default router
