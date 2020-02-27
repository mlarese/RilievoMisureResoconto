<template>
  <DxForm>
    <DxGroupItem :col-count="1" css-class="second-group">
      <DxGroupItem>
        <DxSimpleItem data-field="GL_Descrizione" />
        <DxSimpleItem data-field="GL_Committente" />
        <DxSimpleItem data-field="GL_Indirizzo" />
      </DxGroupItem>
    </DxGroupItem>
  </DxForm>
</template>

<script>

import {
  DxForm,
  DxSimpleItem,
  DxGroupItem,
  DxLabel
} from 'devextreme-vue/form';

export default {
  components: {
    DxForm,
    DxSimpleItem,
    DxGroupItem,
    DxLabel
  }
}

</script>