<template>
  <div>

    <v-autocomplete v-model="record.EV_Classificazione" label="Classificazione" :items="structure" item-text="name" item-value="name">

      <template slot="item" slot-scope="{item}">

        <template>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.group"></v-list-item-subtitle>
          </v-list-item-content>

        </template>
      </template>
    </v-autocomplete>

  </div>

</template>

<script>
import _isArray from 'lodash/isArray'
import _isString from 'lodash/isString'

export default {
  name: "ClassificazioneFactory",
  props: ['label', 'structure', 'record'],
  computed: {
    currentComponent () {
      if(this.structure && _isArray(this.structure)) {
        return 'ClassificazioneCombo'
      }

      return 'ClassificazioneInput'
    }
  }
}
</script>

