<template>
  <div>
    <Panel style="heigh: 100vh">
      <div slot="toolbarTitle">
        <div v-if="$vuetify.breakpoint.xsOnly">
          <v-row no-gutters>
            <v-col cols="2">
              <v-avatar size="40" class="mt-1">
                <v-img
                  :src="
                    ui.risorsaPrinc
                      ? ui.risorsaPrinc.thumbnailUrl
                      : require('../../assets/images/product.png')
                  "
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <div class="subtitle-1 ellipseText">
                <b>{{ record.JSDescrizione }}</b>
              </div>
              <div class="caption ellipseText">{{ ui.catalogoDesc }}</div>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </div>
        <div v-else>Articolo</div>
      </div>

      <div slot="mainContent">
        <div v-if="$vuetify.breakpoint.smAndUp">
          <v-row class="mx-2">
            <v-col cols="auto">
              <v-avatar size="75" class="pb-0">
                <v-img
                  :src="
                    ui.risorsaPrinc
                      ? ui.risorsaPrinc.thumbnailUrl
                      : require('../../assets/images/product.png')
                  "
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col class="align-self-center">
              <div class="title ellipseText">
                <b>{{ record.JSDescrizione }}</b>
              </div>
              <div class="caption ellipseText">{{ ui.catalogoDesc }}</div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </div>

        <!-- Elenco files dell'articolo -->
        <v-container>
          <v-card
            flat
            :style="{
              'max-height': getMaxHeight() + 'px',
              'overflow-y': 'scroll'
            }"
          >
            <v-list three-line>
              <template v-for="(item, i) in record.JSRisorse">
                <v-list-item :key="item.JSRisID" @click="showImage(i)">
                  <v-list-item-avatar size="80" tile>
                    <v-img
                      :src="item.risorsa ? item.risorsa.thumbnailUrl : ''"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      v-html="item.JSRisDesc"
                    ></v-list-item-title>
                    <!-- <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle> -->
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-container>
      </div>
    </Panel>

    <GalleryBox
      ref="GalleryBox"
      :listaRisorse="record.JSRisorse.map((jsr) => jsr.risorsa)"
    />
  </div>
</template>

<style scoped>
.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
}
.ellipseText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabs__content_small {
  height: calc(100vh - 110px);
  overflow: auto;
}
.tabs__content_large {
  min-height: 200px;
  max-height: calc(100vh - 250px);
  overflow: auto;
}
</style>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import Panel from '../Containers/Panel'
import GalleryBox from '../Risorse/GalleryBox'
const storeName = 'articoli'

export default {
  components: {
    Panel,
    GalleryBox
  },
  computed: {
    ...mapState(storeName, ['record', 'ui'])
  },
  methods: {
    exit() {
      this.$router.replace(`/${storeName}`)
    },
    getMaxHeight() {
      let offset = -10
      if (this.$el) offset = this.$el.offsetTop
      if (this.$vuetify.breakpoint.xsOnly) {
        return this.$vuetify.breakpoint.height - 100 + offset
      } else {
        return this.$vuetify.breakpoint.height - 200 + offset
      }
    },
    showImage(index) {
      const lista = this.record.JSRisorse.map((jsr) => jsr.risorsa)
      this.$refs.GalleryBox.showGallery({ lista, index })
    }
  }
}
</script>
