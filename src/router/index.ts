/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

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

router.beforeEach(async (to, from, next) => {
  const storeUser = useUserStore();
  const storeProject = useProjectStore();

  if (to.meta?.redirect) {
    window.location.href = to.meta.redirect;
    return;
  }

  if (!storeUser.user.id) {
    try {
      const config = await storeUser.getConfig();

      if (!config?.last_project) {
        next({ name: 'main' });
        return;
      }

      try {
        await storeProject.getProject(config.last_project);
        next();
      } catch (error) {
        next({ name: 'main' });
      }
    } catch (error) {
      next({ name: 'main' });
    }
    return;
  }

  next();
});

export default router
