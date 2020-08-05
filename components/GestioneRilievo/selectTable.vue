<template>
  <v-card>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Selezionare un valore</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows" :key="i">
              <td @click="rowSelezionata(row)">{{ row.JSTabRowDesc }}</td>
              <!-- <td>{{ item.calories }}</td> -->
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: { rows: { type: Array, default: [] } },

  methods: {
    rowSelezionata(row) {
        this.$emit('onRigaSelezionata', row)
    },
    toColor(num) {
      num >>>= 0
      var b = num & 0xff,
        g = (num & 0xff00) >>> 8,
        r = (num & 0xff0000) >>> 16,
        a = (((num & 0xff000000) >>> 24) / 255).toFixed(1)
      return 'rgba(' + [r, g, b, a].join(',') + ')'
    }
  }
}
</script>