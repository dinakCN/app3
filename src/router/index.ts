/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '../stores/user'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // routes,
  extendRoutes: setupLayouts,
})

/**
 * Before each route update
 */
router.beforeEach(async (to, from) => {

  if (to.meta?.redirect) {
    return window.location.href = to.meta.redirect
  }

  // console.log(to)

  /**
   * Store
   */
  const storeUser = useUserStore()

  /**
   * User Auth
   */
  if (!storeUser.user.id && to.meta.requiresAuth) {

    return storeUser.getConfig()
      .then((obj) => {

        // console.log(obj)

        if (!obj?.last_project) return { name: 'main' }

        // return storeUser.getProject(obj.last_project)
        //   .then(
        //     () => false,
        //     () => { name: 'main' }
        //   )
      },
        () => {
          return { name: 'main' }
        }
      )
  }

  return true
})

export default router
