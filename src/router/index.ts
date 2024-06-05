/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useUserStore } from '../stores/user'
import { useProjectStore } from '../stores/project'
import {useProjectsStore} from "../stores/projects";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: setupLayouts,
})

/**
 * Before each route update
 */
router.beforeEach(async (to, from, next) => {
  if (to.meta?.redirect) {
    return next({ path: to.meta.redirect });
  }

  const mainPage = { name: 'main' };
  const storeUser = useUserStore();
  const storeProject = useProjectStore();

  try {
    if (!storeUser.user.id && to.meta.requiresAuth) {
      await storeUser.getConfig();
    } else {
      const { last_project } = storeProject;
      if (!last_project) {
        return next(mainPage);
      }
      await storeProject.getProject(last_project);
      return next();
    }
  } catch (error) {
    console.error('Routing error:', error);
    return next(mainPage);
  }

  return next();
});

export default router
