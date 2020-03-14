<!--eslint-disable-->
<template>
    <div>
        <v-toolbar class="elevation-0" v-if="title !== ''" dense style="background: white" >
            <v-toolbar-title class="subtitle-1">
                <b>{{title}}</b>
            </v-toolbar-title>

        </v-toolbar>

        <v-card slot="container-top" class="elevation-0 pa-0" style="min-height:100px">
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
