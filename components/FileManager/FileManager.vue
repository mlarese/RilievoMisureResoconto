<template>
    <div class="align-center" :class="clazz">
        <DxFileManager
                :customize-thumbnail="customizeIcon"
                v-show="!previewVisible"
                :root-folder-name="rootFolderName"
                :file-provider="fileItems"
                selection-mode="single"
                :customize-detail-columns="fileManagerColumns"
                @current-directory-changed="onChangeDir"
                @selected-file-opened="onSelectFile"
                height="400" >
            <DxItemView mode="thumbnails"/>

            <DxPermissions  :create="false"  :copy="false"  :move="false"  :remove="false" :rename="false"  />
        </DxFileManager>

        <div class="text-center" v-show="previewVisible">
            <v-pagination
                    dark
                    class="elevation-0"
                    v-model="curPreviewIndex"
                    :length="iconNames.length"
            ></v-pagination>
        </div>

        <div v-show="previewVisible"
             v-touch="{
              left: () => nextImage(),
              right: () => previousImage()
            }"
        >
            <img v-show="previewVisible" class="mt-2 gallery-preview-image" ref="previewImage"  :src="null"/>

        </div>
    </div>
</template>

<script>
  import { DxFileManager, DxPermissions, DxItemView } from 'devextreme-vue/file-manager';
  import {emptyStructure, fileManagerColumns} from '../../assets/allegati'
  import {previewFile, appDirImages,appDir, getFs, workAppDir} from '../../assets/filesystem'
  import {mapState, mapActions} from 'vuex'
  import Vue from 'vue'

  export default {
    created () {
      getFs()
      this.load(this.entryPoint)
    },
    data () {
      return {
        fileName:'',
        icons: {},
        iconNames: [],
        curPreviewIndex: 1,
        clazz: 'none'
      }
    },
    components: {
      DxFileManager,
      DxPermissions,
      DxItemView
    },
    computed: {
      ...mapState('filesystemreader', ['fileItems'])
    },
    props: {
      rootFolderName: {default: 'Allegati'},
      entryPoint: {default: ''},
      previewVisible: {default: false}
    },
    watch: {
      curPreviewIndex () {
        this.previewImageByCurPreviewIndex()
      }
    },
    methods: {
      nextImage () {
        if(this.iconNames.length === this.curPreviewIndex ) this.curPreviewIndex = 1
        else this.curPreviewIndex++
      },
      previousImage () {
        if(this.curPreviewIndex === 1) this.curPreviewIndex = this.iconNames.length
        else this.curPreviewIndex--
      },
      previewImageByCurPreviewIndex () {
        const imgName = this.iconNames[this.curPreviewIndex - 1]
        const fname = `${workAppDir(this.entryPoint)}/${imgName}`
        previewFile(fname, this.$refs['previewImage'])
      },
      ...mapActions('filesystemreader', ['load']),
      customizeIcon (fileManagerItem) {
        //if(fileManagerItem.isDirectory) { return 'images/folder256.png'}
        let imgName = `${workAppDir(this.entryPoint)}/${fileManagerItem.relativeName}`

        var fileExtension = fileManagerItem.getExtension();
        switch (fileExtension) {
          case '.png':
          case '.jpg':
          case '.jpeg':

            if(!this.icons[fileManagerItem.relativeName]) {
              Vue.set(this.icons,fileManagerItem.relativeName, fileManagerItem.relativeName)
              this.iconNames.push(fileManagerItem.relativeName)
            }

            return fileManagerItem.relativeName
        }
      },
      fileManagerColumns,
      onSelectFile (a) {
        this.fileName = a.fileItem.relativeName
        const fname = `${workAppDir(this.entryPoint)}/${a.fileItem.relativeName}`
        this.curPreviewIndex = this.iconNames.findIndex(item => item === this.fileName) + 1
        previewFile(fname, this.$refs['previewImage'])
        this.$emit('on-preview-file')
      },
      onChangeDir (a) {
        const curDir = a.component.getCurrentDirectory()
        this.clazz = curDir.name
        if(curDir.name === 'Immagini') {

        }
        for(let icon in this.icons) {
          var img = document.querySelector(`img[src="${icon}"]`);
          const imgName = `${workAppDir(this.entryPoint)}/${icon}`
          previewFile(imgName, img)
        }

      }
    }
  };
</script>
