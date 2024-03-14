<template>
  <div>
    <v-card 
      v-show="!filter || filter && item.length !== 0"
      class="rounded-lg"
      style="z-index: 1"
    >
      <!-- COMMAND -->
      <v-card-actions>
        <v-row no-gutters>

          <v-col cols="auto d-flex align-center">

            <v-scale-transition group hide-on-leave>
              <v-chip
                v-show="order"
                key="order"                
                :color="getPoint[clid].color"
                class="text-caption font-weight-medium"
              >
                <span v-if="!$vuetify.breakpoint.mobile">{{ $t('cargolist.header') }} # </span>{{ order ? order : '...' }}
              </v-chip>
              <v-chip 
                v-if="!order"
                key="!order"                
                class="text-caption white--text"
                color="red lighten-1"
                close
                close-icon="mdi-close"
                @click:close="changeView()"     
              >
                {{ this.$t('cargolist.disable') }}
              </v-chip>
            </v-scale-transition>

          </v-col>

          <v-col class="flex-grow-1 d-flex align-center">
            <v-btn
              text
              rounded
              class="ml-1"
              :class="[order ? getPoint[clid].color : 'white']"
              :style="(!order && $vuetify.breakpoint.mobile) && 'display:none;'"
              @click="renamePoint()"
            >
              <span 
                class="text-truncate text-caption font-weight-medium"
                :style="$vuetify.breakpoint.mobile && 'max-width:120px'"
              >
                {{ getPoint[clid]['name'] }}
              </span>
              <v-icon v-if="!$vuetify.breakpoint.mobile" small right >bx-rename</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn 
              :disabled="item.length === 0"
              icon
              @click="changeMini()"
            >    
              <v-icon small>{{ logoMini }}</v-icon>
            </v-btn>
            <v-btn
              :disabled="item.length === 0"
              icon
              @click="changeView()"
            >
              <v-icon small>{{ logoView }}</v-icon>
            </v-btn>
            <v-btn 
              icon
              @click="removePoint()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>

        </v-row>
      </v-card-actions>

      <!-- MINI -->
      <v-card-text
        v-if="getPoint[clid].mini && item.length > 0"
        class="d-flex align-center caption black--text lighten-3"
      > 
        <div>{{ this.$t('cargolist.windoff') }}</div>
        <v-btn
          text
          small
          class="caption mx-1"
          color="primary"
          @click="changeMini()"
        >
          {{ this.$t('cargolist.windon') }}
        </v-btn>
        <v-spacer></v-spacer>
        <div>
          {{ subResult }}
        </div>
      </v-card-text>

      <!-- BODY -->
      <div v-if="!getPoint[clid].mini">
        
        <v-card-text v-show="item.length" class="py-0">
          <v-row no-gutters>

            <v-col cols="auto" class="d-flex align-center">
              <v-checkbox
                :value="selectAll"                
                :indeterminate="selectAlmostAll"
                @click.stop="onSelectAll(selectAll)"
              ></v-checkbox>
            </v-col>

            <v-col v-if="selected.length == 0 && !$vuetify.breakpoint.mobile && item.length" cols="auto" class="d-flex align-center">
              <div class="caption mx-1">
                {{ $t('common.selectall') }}
              </div>
            </v-col>

            <v-col v-if="selected.length > 0" cols="auto" class="align-self-center">
              <div class="d-flex align-center">
                <v-btn 
                  text
                  small
                  color="primary"
                  class="font-weight-medium px-1"          
                  @click="editItems()"
                >
                  <v-icon left>bx-edit</v-icon>
                  <span>{{ $t('common.edit') }}</span>
                </v-btn>

                <v-btn 
                  text
                  small
                  color="primary"
                  class="font-weight-medium px-1"          
                  @click="moveItems()"
                >
                  <v-icon left>bx-repost</v-icon>
                  <span>{{ $t('common.move') }}</span>
                </v-btn>

                <v-btn
                  text
                  small
                  color="primary"
                  class="font-weight-medium px-1" 
                  @click="setTemplate()"
                >
                  <v-icon left>bx bx-save</v-icon>
                  <span>{{ $t('templates.tempsave') }}</span>
                </v-btn>

                <v-btn
                  text
                  small
                  color="primary"
                  class="font-weight-medium px-1" 
                  @click="removeItemsSelected()"
                >
                  <v-icon left>bx-trash</v-icon>
                  <span >{{ $t('common.delete') }}</span>
                </v-btn>
              </div>
            </v-col>

            <v-col class="ml-1 d-flex align-center justify-end">
              <div class="text-caption" :class="selected.length > 0 && 'primary--text font-weight-medium'">
                {{ subResult }}
              </div>
            </v-col>

          </v-row>
        </v-card-text>

        <!-- LIST -->
        <v-list color="transparent pt-0">
          <v-scale-transition group>
            <template
              v-for="(i) in item"       
            > 

              <v-list-item                
                :key="i.id"        
                :class="selectedById[i.id] && 'v-list-item--active primary--text'"
                :link="!$vuetify.breakpoint.mobile"
                style="height:76px;"
              >
                <v-lazy width="100%">
                  <v-row no-gutters>
                    <v-col cols="auto" class="d-flex align-center">
                      <v-checkbox v-model="selected" :value="i.id"></v-checkbox>
                    </v-col>
                    <v-col cols="auto" class="d-flex align-center mx-1">
                      <v-list-item-avatar 
                        class="mx-0"
                        :color="i.cr"
                        @click.stop="$router.push(`/cargo/item/${clid}/${i.id}`)"
                      >  
                        <v-icon 
                          color="grey darken-4"
                          rounded
                        >
                          {{ i.icon }}
                        </v-icon>
                      </v-list-item-avatar>
                    </v-col>
                    <v-col class="flex-grow-1 text-truncate mx-1 d-flex align-center">

                      <v-list-item-content 
                        @click="$router.push(`/cargo/item/${clid}/${i.id}`)"
                      >

                        <v-list-item-title class="body-2 font-weight-medium">
                          <span v-if="i.id < 10000">{{ i.id }}. </span>{{ i.nm }}
                        </v-list-item-title>

                        <v-list-item-subtitle :class="selectedById[i.id] && 'primary--text'">
                          {{ i.tt }} {{ i.sz }}, {{ i.cn }} {{ $t('units.co') }}
                        </v-list-item-subtitle>
                        
                        <v-list-item-subtitle>
                          
                          <v-icon
                            :color="i.st ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi-layers-outline
                          </v-icon>

                          <span 
                            :class="i.st ? 'grey--text text--darken-3' : 'grey--text text--lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ $t('item.st.label') }}: {{ i.attr.st }}
                          </span>
                        
                          <v-icon 
                            :color="i.lm && i.st === 1 ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi-plus
                          </v-icon>

                          <span 
                            :class="i.lm && i.st === 1 ? 'grey--text text--darken-3' : 'grey--text text--lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ $t('item.lm.label') }}: {{ i.attr.lm }}
                          </span>

                          <v-icon 
                            :color="i?.rt ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi-swap-horizontal
                          </v-icon>

                          <span 
                            :class="i?.rt ? 'grey--text text--darken-3' : 'grey--text text--lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ $t('item.rt.label') }}: {{ i.attr.rt }}
                          </span>

                          <v-icon 
                            :color="i?.ov ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi-swap-vertical
                          </v-icon>

                          <span 
                            :class="i?.ov ? 'grey--text text--darken-3' : 'grey--text text--lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ $t('item.ov.label') }}: {{ i.attr.ov }}
                          </span>

                        </v-list-item-subtitle>
                      </v-list-item-content>

                    </v-col>
                    <v-col cols="auto" class="d-flex align-center">
                      <v-list-item-action class="mr-0">
                        <div class="d-flex align-center">
                          <v-btn
                            icon
                            @click="$router.push(`/cargo/item/${clid}/${i.id}`)"
                          >
                            <v-icon>bx-edit-alt</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            @click.stop="setTemplateOne(i.id)"
                          >
                            <v-icon>bx-save</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            @click.stop="copyItem(i.id)"
                          >
                            <v-icon>bx-copy</v-icon>
                          </v-btn>
                          <v-btn 
                            icon
                            @click.stop="removeItem(i.id)"
                          >
                            <v-icon>bx-trash</v-icon>
                          </v-btn>
                        </div>
                      </v-list-item-action>
                    </v-col>
                  </v-row>
                </v-lazy>
              </v-list-item>

            </template>

          </v-scale-transition>
        </v-list>

        <template v-if="item.length === 0">
          <div class="text-body-2 grey--text text--darken-2 mx-3 mt-4 mb-5 text-center"> 
            <div class="font-weight-bold mb-1">... {{ $t('cargolist.no-items') }} ...</div>
            <div class="d-flex justify-center font-weight-thin">
              <div>{{ $t('cargolist.no-items-description-1') }}</div>
              <div class="mx-1 teal--text font-weight-bold">{{ $t('common.or') }}</div>
              <div>{{ $t('cargolist.no-items-description-2') }}</div>
              <div class="mx-1 teal--text font-weight-bold">{{ $t('common.or') }}</div>
              <div>{{ $t('cargolist.no-items-description-3') }}</div>
            </div>
          </div>
        </template>
        
        <!-- BUTTONS -->
        <v-card-actions>
          <v-row dense>

            <v-col class="text-right">

              <v-badge
                color="error"
                dot
                :value="!userPro && hover.file"
              >

                <v-hover v-model="hover.file">
                  <v-btn
                    rounded
                    text
                    class="text-caption text-uppercase"
                    @click="getFile()"
                  >
                    <v-icon left>
                      bx-file
                    </v-icon>
                    <span>{{ $t('cargolist.addfromfile') }}</span>
                  </v-btn>
                </v-hover>

              </v-badge>
            </v-col>

            <v-col cols="auto" class="text-center">

              <v-badge
                color="error"
                dot
                :value="!userPro && hover.custom"
              >

                <v-hover v-model="hover.custom">
                  <v-btn 
                    rounded
                    class="px-2 font-weight-regular"
                    color="primary"
                    @click="addItem()" 
                  >
                    <v-icon left>
                      bx bx-plus-circle
                    </v-icon>
                    <span>
                      {{ $t('cargolist.addcargo') }}
                    </span>
                  </v-btn>
                </v-hover>
              </v-badge>
            </v-col>

            <v-col class="text-left">
              <v-btn
                rounded
                text
                class="text-caption text-uppercase"
                @click="getTemplates()"
              >
                <v-icon left>
                  bx bxs-save
                </v-icon>
                <span>{{ $t('cargolist.addfromtemplate') }}</span>
              </v-btn>
            </v-col>

          </v-row>        

        </v-card-actions>

      </div>
    </v-card>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| CargoList Component
|---------------------------------------------------------------------
|
*/

import { mapGetters, mapState } from 'vuex'
import { getDigits } from '@/configs/functions/getDigits.js'

export default {
  name: 'CargoList',
  props: {
    item: {
      type: Array,
      default: () => []
    },
    clid: {
      type: Number,
      default: 0
    },
    order: {
      type: Number,
      default: 0
    },
    filter: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectAll: false,
      selectAlmostAll: false,
      selected: [],
      hover: {
        custom: false,
        file: false
      }
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsCargo', 'getPoint']),
    ...mapState('app', ['user']),

    userPro() {
      return Boolean(this.user.tarif.type)
    },

    logoMini() {
      return this.getPoint[this.clid]?.mini ? Object.freeze('bx-window-alt') : Object.freeze('bx-minus')
    },
    logoView() {
      return this.order ? Object.freeze('bx bxs-hide') : Object.freeze('bx bx-show-alt')
    },
    subResult() {
      
      if (!this.item.length) return ''

      let array = this.item

      if (this.selected.length)  {
        array = this.selected.map((i) => this.item.filter((item) => item.id === i)[0])
      }

      const result = array.reduce((o, i) => {

        o['cn'] += Number(i.cn)
        o['wg'] += Number(i.wf)
        o['vl'] += Number(i.vl)

        return o
      }, { cn: 0, wg: 0, vl: 0 })

      result.wg = getDigits(result.wg)
      result.vl = getDigits(result.vl)

      return Object.freeze(Number(result.cn) + ' ' + this.$t('units.co') + ', ' +  
      result.wg + ' ' + this.$t('units.wght.' + this.unitsCargo.wght) + ', ' + 
      result.vl + ' ' + this.$t('units.m3'))
    },
    selectedById() {
      if (!this.selected.length) return {}

      return this.selected.reduce((out, item) => {
        out[item] = true

        return out
      }, {})
    }

  },
  watch: {
    selected(val) {
      this.$nextTick(() => {
        if (this.selectAll) {
          if (val.length === 0) {
            this.selectAll = false
            this.selectAlmostAll = false
          } else {
            if (this.item.length === val.length) {
              this.selectAlmostAll = false
            } else {
              this.selectAlmostAll = true
            }
          }
        }
      })
    }
  },
  mounted() {

  },
  methods: {
    // SELECTED COMMAND

    onSelectAll() {
      if (this.selectAll) {
        this.selected = []
      } else {
        this.selected = this.item.map((i) => i.id)
      }

      this.selectAlmostAll = false
      this.selectAll = !this.selectAll
    },

    selectedObject() {
      return { clid: this.clid, selected: this.selected }
    },
    
    clearSelected() {
      this.selected = []
      this.selectAll = false
      this.selectAlmostAll = false
    },

    // ITEMS

    editItems() {
      this.$emit('edititems', this.selectedObject())
    },
    moveItems() {
      this.$emit('moveitems', this.selectedObject())
    },
    removeItemsSelected() {
      this.$emit('removeitems', this.selectedObject())
    },
    removeItem(id) {
      this.$emit('removeitem', id)
      if (this.selected.includes(id)) this.selected = this.selected.filter((i) => i !== id)
    },
    copyItem(id) {
      this.$emit('copyitem', id)
    },
    addItem() {
      // if (this.userPro) return this.$emit('showlimitbuttons')

      this.$emit('additem', this.clid)
    },

    // POINT
    
    renamePoint() {
      this.$emit('renamepoint', { clid: this.clid, name: this.getPoint[this.clid]['name']  })
    },
    removePoint() {
      this.$emit('removepoint', { clid: this.clid, length: this.item.length })
    },
    changeMini() {
      this.$emit('changepointmini', this.clid)
    },
    changeView() {
      this.$emit('changepointview', this.clid)
    },

    // FILE

    getFile() {
      // if (this.userPro) return this.$emit('showlimitbuttons')

      this.$emit('getfile', this.clid)
    },

    // TEMPLATES
    getTemplates() {
      this.$emit('gettemplate', this.clid)
    },
    setTemplate() {
      this.$emit('settemplate', this.selectedObject())
    },
    setTemplateOne(id) {
      this.$emit('settemplateone', id)
    }

  }
}
</script>
<style scoped>
.scroller {
  height: 100%;
}

.item_list {
  height: 66px;
}
</style>

// lang ok