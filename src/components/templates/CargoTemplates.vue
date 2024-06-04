<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <Templates
      :data="dataList"
      @close="close"
      @del="del"
      @submit="submit"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { rt, ov } from '@/configs/items.js';
import { pallet } from '@/configs/templates/cargo.js';
import { getText } from '@/configs/functions/gettext.js';
import { getDigits } from '@/configs/functions/getDigits.js';
import { getWght } from '@/configs/functions/getunits.js';
import { computed, reactive, ref, Ref } from 'vue';
import useTemplateName from '../../hooks/useTemplateName';
import { useUserStore } from '../../stores/user';
import { useProjectStore } from '../../stores/project';
import {useI18n} from "vue-i18n";

const { getName } = useTemplateName();
const userStore = useUserStore();
const projectStore = useProjectStore();

const templates = ref<any[]>([]);
const dialog: Ref<boolean> = ref(false);

const { t } = useI18n();

const start = reactive({
  rt,
  ov,
});

const dataList = computed(() => {
  if (!templates.value.length) return [];
  return templates.value.reduce((o, i) => {
    // name
    i.nm = getName(i);

    if (!i.icon) i.icon = 'bx bxs-extension';

    // text
    i.text = text(i.data);

    // freeze
    for (const p of Object.keys(i)) i[p] = Object.freeze(i[p]);

    o.push(i);

    return o;
  }, []);
});

const submit = (arr: any[]) => {
  const data = arr.map(i => ({
    id: null,
    nm: getName(i),
    ln: i.ln,
    wd: i.wd,
    hg: i.hg,
    wg: i.wg,
    cn: i.cn,
    pg: i.pg,
    st: i.st,
    lm: i.lm,
    rt: i.rt !== undefined ? Number(i.rt) : Number(start.rt.val),
    ov: i.ov !== undefined ? Number(i.ov) : Number(start.ov.val),
    cr: i.cr,
    un: { size: String(userStore.config.units.cargo.size), wght: String(userStore.config.units.cargo.wght) },
    point: null,
  }));

  dialog.value = false;
};

const open = () => {
  dialog.value = true;
  templates.value = [];

  // default
  for (const i of [...pallet]) {
    for (const p of Object.keys(i)) {
      i[p] = Object.freeze(i[p]);
    }
    templates.value.push(i);
  }

  // mine & shared
  projectStore.getTemplateList('c').then((r) => {
    if (r.length) {
      r.forEach((i, index) => {
        i.add_time = 50 + index;
        for (const p of Object.keys(i)) i[p] = Object.freeze(i[p]);
        templates.value.push(i);
      });
    }
  });

  return new Promise((resolve, reject) => {
    resolve(templates);
    reject('Failed to open templates');
  });
};

const close = () => {
  dialog.value = false;
};

const del = (clid: number) => {
  const index = templates.value.findIndex((i) => String(i.clid) === String(clid));
  if (index !== -1) {
    templates.value.splice(index, 1);
    projectStore.remTemplate({ type: 'c', clid });
  }
};

const text = (data: any[]) => {
  if (data.length === 1) {
    return `${getText(
        data[0],
        t(`units.size.${userStore.config.units.cargo.size}`),
        t(`units.wght.${userStore.config.units.cargo.wght}`),
        userStore.config.units.cargo
    )} ${data[0].cn} ${t('units.co')}`;
  }

  const result = data.reduce(
      (o, item) => {
        o.cn += Number(item.cn);
        o.wg += item.cn * item.wg;
        return o;
      },
      { cn: 0, wg: 0 }
  );

  return `${result.cn} ${t('units.co')}, ${getDigits(getWght(result.wg, userStore.config.units.cargo.wght))} ${t(
      `units.wght.${userStore.config.units.cargo.wght}`
  )}`;
};
</script>
