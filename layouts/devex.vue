<template>
    <div data-options="dxLayout: { name: 'default'}">
        <div data-options="dxTransition: { name: 'main', animation: 'slide' }">
            <div data-options="dxContentPlaceholder : { name: 'header' } " ></div>
            <div data-options="dxContentPlaceholder: {name: 'content' }"></div>
            <div data-options="dxContentPlaceholder : { name: 'footer' } " ></div>
        </div>
    </div>
</template>

<script>
  import { DxResponsiveBox, DxItem, DxLocation, DxCol, DxRow } from 'devextreme-vue/responsive-box'

  export default {
    components: {
      DxResponsiveBox,
      DxItem,
      DxLocation,
      DxCol,
      DxRow
    },
    data() {
      return {
        screen(width) {
          return (width < 700) ? 'sm' : 'lg';
        }
      }
    }
  }
</script>
<style>
    .demo-container, #page{
        height: 100%;
        min-height: 500px;
        border: 3px solid red;
    }

    .header {
        background-color: rgba(243, 158, 108, 0.80);
        text-align: center;
    }

    .content {
        background-color: rgba(245, 229, 166, 0.80);
    }

    .left-side-bar {
        background-color: rgba(148, 215, 199, 0.80);
    }

    .right-side-bar {
        background-color: rgba(119, 199, 231, 0.80);
    }

    .footer {
        background-color: rgba(123, 155, 207, 0.80);
    }

    .item {
        height: 100%;
    }

    #page p {
        font-size: 20px;
        padding-top: 10px;
        text-align: center;
    }
</style>
