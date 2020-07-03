<template>
  <div>
    <Panel>
      <div slot="toolbarTitle">
        <div v-if="$vuetify.breakpoint.xsOnly">
          <v-row no-gutters>
            <v-col cols="2">
              <v-avatar size="40">
                <v-img :src="ui.imgURL || require('../../assets/images/contact.jpg')"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <div class="subtitle-1 ellipseText">
                <b>{{ record.JSDescrizione }}</b>
              </div>
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
                <v-img :src="ui.imgURL || require('../../assets/images/contact.jpg')" ></v-img>
              </v-avatar>
            </v-col>
            <v-col class="align-self-center">
              <div class="title ellipseText">
                <b>{{ record.JSDescrizione }}</b>
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </div>
      </div>
    </Panel>
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
const storeName = 'articoli'

export default {
  components: {
    Panel
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState(storeName, ['record', 'ui'])
  },
  methods: {
    exit() {
      this.$router.replace(`/${storeName}`)
    }
  }
}
</script>
