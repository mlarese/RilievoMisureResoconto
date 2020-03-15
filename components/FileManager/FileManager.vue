<template>
    <DxFileManager
            :root-folder-name="rootFolderName"
            :file-provider="fileItems"
            selection-mode="single"
            :customize-detail-columns="fileManagerColumns"
            height="400" >
        <DxPermissions  :create="false"  :copy="false"  :move="false"  :remove="false" :rename="false"  />
    </DxFileManager>
</template>

<script>
  import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
  import {emptyStructure, fileManagerColumns} from '../../store/allegati'

  export default {
    components: {
      DxFileManager,
      DxPermissions
    },
    props: {
      fileItems: {default: emptyStructure},
      rootFolderName: {default: 'Allegati'}
    },
    methods: {
      fileManagerColumns
    }
  };
</script>
