<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <v-card :loading="loading">
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Editar Categoria' : 'Nova Categoria' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Nome" type="text" v-model="model.name" required></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <v-select
                  chips
                  label="Tipo Movimentação"
                  :items="movementTypes"
                  item-value="value"
                  item-title="name"
                  v-model="model.type"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Fechar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="submit">Salvar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <snackbar ref="snack" />
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '@/models/Category'
import { movementTypes } from '@/mixins/movementTypes'
import Snackbar from '@/components/Snackbar.vue'
import { createAxios } from '@/services/http'

const http = createAxios()
const dialog = ref(false)
const model = ref<Category>({})
const loading = ref(false)
const isEdit = ref(false)
const snack = ref()

defineExpose({
  openDialog
})

const emit = defineEmits(['submit'])

function openDialog(type: number, category?: Category = null) {
  model.value.type = type
  if (category) {
    isEdit.value = true
    Object.assign(model.value, category)
  }
  dialog.value = true
}

function submit() {
  if (isEdit.value) {
    return updateCategory()
  }
  return saveCategory()
}

async function saveCategory() {
  try {
    await http.post('/categories', model.value)
    snack.value.showSnackBar('Categoria cadastrada com sucesso')
    dialog.value = false
    emit('submit')
  } catch (err) {
    console.log(err)
  }
}

async function updateCategory() {
  try {
    await http.put(`/categories/${model.value.id}`, model.value)
    snack.value.showSnackBar('Categoria atualizada com sucesso')
    dialog.value = false
    emit('submit')
  } catch (err) {
    console.log(err)
  }
}
</script>
