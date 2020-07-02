<template>
<div class="pa-4">
  <v-form v-model="isValid">
    <v-row>
      <v-col cols="12">
        <v-text-field
          dense
          v-model="$record.data.GL_CommittenteDesc"
          label="Descrizione"
          clearable
          :hide-details="hideFetails"
          :rules="[rules.required]"

          :loading="false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          filled
          color="purple"
          rows="2"
          :rules="[rules.required]"
          v-model="$record.data.GL_Descrizione"
          label="Descrizione"
          clearable
          auto-grow
          persistent-hint
          hint="Inserire il committente senza usare gli apostrofi"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        {{$record.data.oggetto}}
        <v-combobox
          :items="[{id: 1, description: 'uno',}, {id: 2, description: 'due'}]"
          item-text="description"
          v-model="$record.data.oggetto"
          item-value="id"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        {{$record.data.oggetto1}}
        <v-combobox
          small-chips
          multiple
          deletable-chips
          chips
          :items="['Uno', 'Due']"
          item-text="description"
          v-model="$record.data.oggetto1"
          item-value="id"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn :disabled="!isValid">Save </v-btn>
      </v-col>

      <v-col cols="12">
        <v-speed-dial   v-model="fab"  direction="top"  bottom right   open-on-hover   >
          <template v-slot:activator>
            <v-btn v-model="fab"   color="blue darken-2"   fab  dark   >
              <v-icon v-if="fab">mdi-close</v-icon>
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-btn
            @click="onCLick"
            fab
            dark
            small
            color="green"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            color="indigo"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            small
            color="red"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-col>
    </v-row>
  </v-form>
</div>
</template>
<script>
import {mapState} from "vuex"
import {rules} from '../../assets/rules'

const storeName = 'gestione_lavori'

export default {
  data () {
    return {
      hideFetails: false,
      isValid: false,
      rules
    }
  },
  methods: {
    onCLick () {
      alert('onClick')
    }
  },
  components: {},
  props: [],
  computed: {
    ...mapState(storeName, ['$record'])
  }
}
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
.v-speed-dial {
  position: absolute;
}

.v-btn--floating {
  position: relative;
}
</style>
