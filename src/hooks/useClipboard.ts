// src/composables/useClipboard.ts
import { useAppStore } from '../stores/app'
import {useI18n} from "vue-i18n";

export const useClipboard = () => {
  const appStore = useAppStore()
  const {t} = useI18n()

  const copy = async (text: string, toastText: string) => {
    try {
      await navigator.clipboard.writeText(text)
        appStore.showSuccess(toastText)
    } catch (err) {
        appStore.showError('Failed to copy: ' + err.message)
    }
  }

  return { copy }
}
