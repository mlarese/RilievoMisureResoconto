<!--eslint-disable-->
<template>
    <div>
        <v-toolbar class="elevation-1" v-if="title !== ''" dense color="info" dark>
            <v-toolbar-title>
                {{title}}
            </v-toolbar-title>

        </v-toolbar>

        <v-card slot="container-top" class="elevation-1 pa-1" style="min-height:100px">
            <v-container grid-list-md  fluid>
            <slot>

            </slot>
            </v-container>
        </v-card>
    </div>
</template>
<script>
  export default {
    name: 'CardPanel',
    props: {
      title: {type: String, default: ''}
    }
  }
</script>
