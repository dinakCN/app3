<template>
  <div>
    <!-- menu level 1 -->
    <NavMenuItem v-for="(level1Item, level1Index) in menu" :key="level1Index" :menu-item="level1Item">
      <template v-if="level1Item.items">

        <!-- menu level 2 -->
        <NavMenuItem
          v-for="(level2Item, level2Index) in level1Item.items"
          :key="level2Index"
          :menu-item="level2Item"
          subgroup
          small
        >
          <template v-if="level2Item.items">

            <!-- menu level 3 -->
            <NavMenuItem
              v-for="(level3Item, level3Index) in level2Item.items"
              :key="level3Index"
              :menu-item="level3Item"
              small
            />
          </template>
        </NavMenuItem>
      </template>
    </NavMenuItem>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

</script>
