// Utilities
import { defineStore } from 'pinia';
import { Ref, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { getWght } from '@/configs/functions/getunits.js';
import { getText } from '@/configs/functions/gettext.js';
import { getVolume } from '@/configs/functions/getvolume.js';
import { getCargoIcon } from '@/configs/functions/geticon.js';
import { getRandomColor } from '../configs/getcolor.js';
import { stByValue, rt, rtByValue, ov, ovByValue, pg, st, } from '../configs/items.js';

import { useUserStore } from './user';
import { useProjectStore } from './project';
import {useAppStore} from "./app";
import {ItemInterface, PointInterface} from "../interfaces/ProjectInterface";

export interface ICargo {
    point: PointInterface[];
    items: ItemInterface[];
}

export const useCargoStore = defineStore('cargo', () => {
    const { t } = useI18n();
    const userStore = useUserStore();
    const projectStore = useProjectStore();
    const appStore = useAppStore();

    /**
     * Cargo
     */
    const cargo: Ref<ICargo> = ref({
        point: [],
        items: [],
    });

    /**
     * Sync
     */
    const sync: Ref<boolean> = ref(false);

    const points = computed(() => {
        return cargo.value.point;
    });

    const point = computed(() => {
        return cargo.value.point.reduce((o, i) => {
            o[i.id] = i;
            return o;
        }, {} as Record<number, PointInterface>);
    });

    const pointOrder = computed(() => {
        let n = 1;
        const order = cargo.value.point.filter((i) => i.view === true);
        return order.reduce((o, i) => {
            o[i.id] = n;
            n++;
            return o;
        }, {} as Record<number, number>);
    });

    const item = computed(() => {
        return cargo.value.items.reduce((out, item) => {
            const i = { ...item };

            i.icon = getCargoIcon(i.pg);
            i.vl = Number(getVolume(i)) * i.cn;
            i.wf = getWght(i.wg * i.cn, userStore.config.units.cargo.wght);
            i.tt = t('item.pg.' + i.pg);
            i.sz = getText(
                i,
                t('units.size.' + userStore.config.units.cargo.size),
                t('units.wght.' + userStore.config.units.cargo.wght),
                userStore.config.units.cargo
            );

            i.rt = Object.prototype.hasOwnProperty.call(i, 'rt') ? i.rt : rt.val;
            i.ov = Object.prototype.hasOwnProperty.call(i, 'ov') ? i.ov : ov.val;

            i.attr = {
                st: Object.freeze(t(stByValue[i.st])),
                lm: Object.freeze(i.st === 1 && i.lm ? getWght(i.lm, userStore.config.units.cargo.wght) + ' ' + t('units.wght.' + userStore.config.units.cargo.wght) : t('common.no')),
                rt: Object.freeze(t(rtByValue[i.rt])),
                ov: Object.freeze(t(ovByValue[i.ov])),
            };

            for (const p of Object.keys(i)) i[p] = Object.freeze(i[p]);
            out[i.id] = Object.freeze(i);

            return out;
        }, {} as Record<number, any>);
    });

    const itemsCount = computed(() => {
        return cargo.value.items.reduce((n, i) => {
            return n + Number(i.cn);
        }, 0);
    });

    const itemsRowCount = computed(() => {
        return cargo.value.items.length;
    });

    const checkID = (id: number, arr: PointInterface[] | ItemInterface[]) => {
        return arr.find((i) => String(i.id) === String(id));
    };

    const setSync = (bool: boolean) => {
        sync.value = bool;
    };

    const addPoint = (name: string) => {
        let id = Date.now();

        while (checkID(id, cargo.value.point)) id = Number(id) + 1;

        cargo.value.point.push({
            id: id,
            view: true,
            mini: false,
            color: getRandomColor(),
            name: name ? name : '...',
        });
    };

    const setProjectLastModified = (time: Date | null = null) => {
        projectStore.project.last_modified = time ? new Date(time) : new Date();
    };

    const removePoint = (id: number) => {
        const index = cargo.value.point.findIndex((p) => String(p.id) === String(id));
        cargo.value.point.splice(index, 1);

        const filter = cargo.value.items.filter((i) => String(i.point) === String(id));

        if (filter.length) setProjectLastModified();

        filter.forEach((item) => {
            const index = cargo.value.items.findIndex((i) => String(i.id) === String(item.id));
            cargo.value.items.splice(index, 1);
        });
    };

    const changePointMini = (id: number) => {
        const index = cargo.value.point.findIndex((p) => String(p.id) === String(id));
        cargo.value.point[index].mini = !cargo.value.point[index].mini;
    };

    const rotatePoint = (id: number) => {
        const index = cargo.value.point.findIndex((p) => String(p.id) === String(id));
        cargo.value.point.splice(index, 2, cargo.value.point[index + 1], cargo.value.point[index]);
        setProjectLastModified();
    };

    const changeViewPoint = (id: number) => {
        const index = cargo.value.point.findIndex((p) => String(p.id) === String(id));
        cargo.value.point[index].view = !cargo.value.point[index].view;
        setProjectLastModified();
    };

    const removeItem = (id: number) => {
        const index = cargo.value.items.findIndex((i) => String(i.id) === String(id))

        cargo.value.items.splice(index, 1)

        setProjectLastModified()
    }

    const copyItem = (id: number) => {
        const e = cargo.value.items.filter((i) => String(i.id) === String(id));
        const i = cargo.value.items.findIndex((i) => String(i.id) === String(id));

        if (e.length && i !== -1) {
            const data = { ...e[0] };

            data.id = cargo.value.items.length + 1;
            while (checkID(data.id, cargo.value.items)) data.id = Number(data.id) + 1;

            data.cr = getRandomColor();
            for (const p of Object.keys(data)) data[p] = Object.freeze(data[p]);

            cargo.value.items.splice(i + 1, 0, data);
        }

        setProjectLastModified();
    };

    const moveItem = (obj: { id: number; clid: number }) => {
        const { id, clid } = obj;

        if (id && clid) {
            cargo.value.items.forEach((i) => {
                if (String(i.id) === String(id)) {
                    i.point = Number(clid);
                    return i;
                }
            });

            setProjectLastModified();
        }

        return false;
    };

    const editItem = (obj: { id: number; data: Partial<ItemInterface> }) => {
        const { id, data } = obj;

        if (id && data) {
            const i = cargo.value.items.findIndex((i) => String(i.id) === String(id));

            if (i !== -1) {
                if (data.nm !== undefined) cargo.value.items[i].nm = data.nm;
                if (data.ln !== undefined) cargo.value.items[i].ln = data.ln;
                if (data.wd !== undefined) cargo.value.items[i].wd = data.wd;
                if (data.hg !== undefined) cargo.value.items[i].hg = data.hg;
                if (data.wg !== undefined) cargo.value.items[i].wg = data.wg;
                if (data.cn !== undefined) cargo.value.items[i].cn = data.cn;
                if (data.pg !== undefined) cargo.value.items[i].pg = data.pg;
                if (data.st !== undefined) cargo.value.items[i].st = data.st;
                if (data.lm !== undefined) cargo.value.items[i].lm = data.lm;
                if (data.rt !== undefined) cargo.value.items[i].rt = data.rt;
                if (data.ov !== undefined) {
                    if (cargo.value.items[i].pg === 1) {
                        cargo.value.items[i].ov = 0;
                    } else {
                        cargo.value.items[i].ov = data.ov;
                    }
                }
                if (data.cr !== undefined) cargo.value.items[i].cr = data.cr;
            }

            setProjectLastModified();
        }
    };

    const addItem = (item: ItemInterface) => {
        for (const p of Object.keys(item)) item[p] = Object.freeze(item[p])

        if (!item.id) {

            if (!item.cr) item.cr = getRandomColor()

            item.id = cargo.value.items.length + 1
            while (checkID(item.id, cargo.value.items)) item.id = Number(item.id) + 1

            cargo.value.items.push(item)

        } else {
            const index = cargo.value.items.findIndex((i) => String(i.id) === String(item.id))

            cargo.value.items.splice(index, 1, item)
        }

        setProjectLastModified()
    }

    const checkCountCargo =(n = 0) => {
        if(Number(itemsCount.value) + Number(n) > userStore.config.limit.items) {
            // this.$metrika.reachGoal('error.limit.cargo')
            return false
        }
        return true
    }
    const checkCountRow =(n = 0) =>{
        if (Number(itemsRowCount.value) + Number(n) > userStore.config.limit.irows)  {
            appStore.showError(`${t('cargo.valid.rows')} ${Number(userStore.config.limit.irows)} { n: ${Number(userStore.config.limit.irows)} })`)
            // this.$metrika.reachGoal('error.limit.row')
            return false
        }

        return true
    }

    const list = (array, bool = false) => {

        const list = [...array]

        list.unshift({ text: 'common.null', value: null })

        if (bool) return list.map((item) => { return { text: t(item.text), value: item.value }})

        return list.map((item) => item.value)

    }

    const packingList = computed(() => {
        return list(pg.default, true)
    })

    const packingListValues = computed(() => {
        return list(pg.default)
    })

    const stuckList = computed(() => {
        return list(st.default, true)
    })

    const stuckListValues = computed(() =>{
        return list(st.default)
    })

    const rotateList = computed(() => {
        return list(rt.default, true)
    })

    const rotateListValues = computed(() => {
        return list(rt.default)
    })

    const overList = computed(() => {
        return list(ov.default, true)
    })

    const overListValues = computed(() => {
        return list(ov.default)
    })

    return {
        points,
        item,
        itemsCount,
        itemsRowCount,
        pointOrder,
        point,
        cargo,
        sync,
        packingList,
        overListValues,
        overList,
        rotateListValues,
        rotateList,
        stuckListValues,
        stuckList,
        packingListValues,
        setSync,
        removePoint,
        addPoint,
        addItem,
        changePointMini,
        rotatePoint,
        changeViewPoint,
        copyItem,
        moveItem,
        editItem,
        checkCountCargo,
        checkCountRow,
        removeItem,
    };
});
