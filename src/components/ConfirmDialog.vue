<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="auto" min-width="400px">
      <v-card>
        <v-card-title class="text-h5">{{ title }}</v-card-title>
        <v-card-text> {{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialog = false"> Cancelar</v-btn>
          <v-btn color="green-darken-1" variant="text" @click="clickAccept"> Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)

defineProps({
  title: { type: String, default: 'Atenção' },
  message: { type: String, default: 'Confirma a ação?' }
})

defineExpose({
  openDialog
})

const emit = defineEmits(['accept'])

function openDialog() {
  dialog.value = true
}

function clickAccept() {
  emit('accept')
  dialog.value = false
}
</script>
