<template>
    <div>
        <DxForm>
                <DxGroupItem caption="Personal Data">
                    <DxItem data-field="committenteDesc" editor-type="dxTextArea" />
                    <DxItem data-field="descrizione" editor-type="dxTextArea"/>
                    <DxItem data-field="luogo" editor-type="dxTextArea" />
                </DxGroupItem>
            </DxForm>
    </div>
</template>

<script>
import { DxForm, DxItem } from 'devextreme-vue/form';
export default {
  components: {
    DxForm,
    DxItem
  }
}
</script>