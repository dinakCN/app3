/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '../stores/user'
import { useProjectStore } from '../stores/project'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: setupLayouts,
})

/**
 * Before each route update
 */
router.beforeEach(async (to, from) => {

  if (to.meta?.redirect) {
    return window.location.href = to.meta.redirect
  }

  /**
   * MainPage
   */
  const mainPage = { name: 'main' }

  /**
   * Store
   */
  const storeUser = useUserStore()
  const storeProject = useProjectStore()

  /**
   * Auth?
   */
  if (!storeUser.user.id && to.meta.requiresAuth) {

    return storeUser.getConfig()
      .then((obj) => {

        const { last_project } = obj

        if (!last_project) return mainPage

        storeProject.getProject(last_project)
          .catch(() => {
            return mainPage
          })

      })
      .catch(() => {
        return mainPage
      })
  }

  return true
})

export default router
