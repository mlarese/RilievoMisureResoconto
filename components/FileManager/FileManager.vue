<template>
    <div class="align-center">

        <DxFileManager
                v-show="!previewVisible"
                :root-folder-name="rootFolderName"
                :file-provider="fileItems"
                selection-mode="single"
                :customize-detail-columns="fileManagerColumns"
                @current-directory-changed="onChangeDir"
                @selected-file-opened="onSelectFile"
                height="400" >
            <DxPermissions  :create="false"  :copy="false"  :move="false"  :remove="false" :rename="false"  />
        </DxFileManager>

        <div v-show="previewVisible" class="caption align-center mt-2">{{fileName}}</div>
        <img v-show="previewVisible" class="mt-2" ref="previewImage" style="padding:4px;border: 6px solid #e1e1e1;max-width: 90%" :src="null"/>
    </div>
</template>

<script>
  import { DxFileManager, DxPermissions } from 'devextreme-vue/file-manager';
  import {emptyStructure, fileManagerColumns} from '../../assets/allegati'
  import {previewFile, appDir} from '../../assets/filesystem'
  import {mapState, mapActions} from 'vuex'

  export default {
    created () {
      this.load()
    },
    data () {
      return {
        fileName:''
      }
    },
    components: {
      DxFileManager,
      DxPermissions
    },
    computed: {
      ...mapState('filesystemreader', ['fileItems']),
    },
    props: {
      rootFolderName: {default: 'Allegati'},
      previewVisible: {default: false}
    },
    methods: {
      ...mapActions('filesystemreader', ['load']),
      fileManagerColumns,
      onSelectFile (a) {
        this.fileName = a.fileItem.relativeName
        const fname = `${appDir}/${a.fileItem.relativeName}`
        previewFile(fname, this.$refs['previewImage'])
        this.$emit('on-preview-file')
      },
      onChangeDir (a) {
      }
    }
  };
</script>
