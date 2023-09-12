<template>
  <v-container fluid>
    <h2 class="text-center mb-3">Categorias 💰</h2>

    <section>
      <v-row>
        <v-col cols="6" md="6" sm="12">
          <v-select
            chips
            label="Tipo Movimentação"
            :items="movementTypes"
            item-value="value"
            item-title="name"
            v-model="type"
            @update:model-value="reloadCategories"
          ></v-select>
        </v-col>
      </v-row>

      <v-progress-linear color="blue-lighten-3" indeterminate v-if="loading"></v-progress-linear>

      <v-list class="mb-5">
        <v-list-item v-for="category in categories" :key="category.id" class="px-0">
          <v-card
            :title="category.name"
            variant="outlined"
            elevation="10"
            @click="openEditModal(category)"
            :disabled="!category.user"
          >
            <v-card-actions>
              <v-btn
                icon="mdi-trash-can"
                size="small"
                :disabled="!category.user"
                @click="confirmDeleteCategory(category.id)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-list-item>
      </v-list>
    </section>

    <v-btn
      icon="mdi-plus"
      size="large"
      color="primary"
      class="floating-button"
      @click="openModal"
    ></v-btn>

    <new-category ref="modal" @submit="reloadCategories" />
  </v-container>

  <confirm-dialog ref="confirm" @accept="deleteCategory"></confirm-dialog>
  <snackbar ref="snack" />
</template>

<script lang="ts" setup>
import { createAxios } from '@/services/http'
import { onMounted, ref } from 'vue'
import type { Category } from '@/models/Category'
import { categoriesMixin } from '@/mixins/categoriesMixin'
import Snackbar from '@/components/Snackbar.vue'
import { movementTypes } from '@/mixins/movementTypes'
import NewCategory from '@/components/NewCategory.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { fetchCategories } = categoriesMixin()
const http = createAxios()
const categories = ref<Category[]>([])
const snack = ref()
const modal = ref()
const loading = ref(true)
const type = ref(1)
const id = ref(null)
const confirm = ref()

onMounted(() => {
  reloadCategories()
})

async function reloadCategories() {
  loading.value = true
  categories.value = await fetchCategories(type.value).finally(() => (loading.value = false))
}

function openModal() {
  modal.value.openDialog(type.value)
}

function openEditModal(category: Category) {
  modal.value.openDialog(type.value, category)
}

function confirmDeleteCategory(categoryId: number) {
  id.value = categoryId
  confirm.value.openDialog()
}

async function deleteCategory() {
  try {
    await http.delete(`/categories/${id.value}`)
    snack.value.showSnackBar('Categoria removida com sucesso!')
    reloadCategories()
  } catch (err) {
    console.log(err)
  }
}
</script>
