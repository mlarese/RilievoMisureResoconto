<!--eslint-disable-->
<template>
    <v-layout class="flex-column">
        <v-toolbar class="elevation-0" v-if="title !== ''" dense style="background: white" >
            <v-toolbar-title >
                <div class="subtitle-1"><b>{{title}}</b></div>
                <div class="caption">{{subtitle}}</div>
            </v-toolbar-title>

        </v-toolbar>

        <v-card  slot="container-top" class="elevation-0 pa-0">
            <v-container grid-list-md  fluid >
            <slot>

            </slot>
            </v-container>
        </v-card>
    </v-layout>
</template>
<script>
  export default {
    name: 'CardPanel',
    props: {
      title: {type: String, default: ''},
      subtitle: {type: String, default: ''},
    }
  }
</script>
