/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import i18n from './vue-i18n'
import axios from './axios'
import VueAxios from 'vue-axios'
import { createManager } from '@vue-youtube/core';

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(i18n)
    .use(router)
    .use(pinia)
    .use(VueAxios, axios)
    .use(createManager())
}
