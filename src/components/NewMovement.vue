<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <v-card :loading="loading">
        <v-card-title>
          <span class="text-h5">Nova Movimentação</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Valor movimentação"
                  type="number"
                  v-model="model.value"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  chips
                  label="Tipo Movimentação"
                  :items="movementTypes"
                  item-value="value"
                  item-title="name"
                  v-model="model.type"
                  @update:model-value="reloadCategories"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  chips
                  label="Categoria"
                  :items="categories"
                  item-value="id"
                  item-title="name"
                  v-model="model.category_id"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Data" type="date" v-model="model.date" required></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Descrição"
                  type="text"
                  v-model="model.obs"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  chips
                  label="Forma de Pgt"
                  :items="paymentForms"
                  item-value="id"
                  item-title="name"
                  v-model="model.payment_form_id"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Fechar</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveMovement">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      icon="mdi-plus"
      size="large"
      color="success"
      class="floating-button"
      @click="dialog = true"
    ></v-btn>
  </v-row>

  <snackbar ref="snack"></snackbar>
</template>

<script setup lang="ts">
import { Movement } from '@/models/Movement'
import { onMounted, ref } from 'vue'
import type { Category } from '@/models/Category'
import { categoriesMixin } from '@/mixins/categoriesMixin'
import { movementTypes } from '@/mixins/movementTypes'
import { format } from 'date-fns'
import { createAxios } from '@/services/http'
import type { PaymentForm } from '@/models/PaymentForm'
import Snackbar from '@/components/Snackbar.vue'

const http = createAxios()
const dialog = ref(false)
const model = ref<Movement>({
  category_id: 1,
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 1,
  payment_form_id: 4
})
const categories = ref<Category[]>([])
const paymentForms = ref<PaymentForm[]>([])
const snack = ref()
const loading = ref(false)

const { fetchCategories } = categoriesMixin()

const emit = defineEmits(['submit'])

onMounted(async () => {
  reloadCategories(model.value.type)
  fetchPaymentForms()
})

async function fetchPaymentForms() {
  try {
    const { data } = await http.get('/payment-forms')
    paymentForms.value = data.data
  } catch (err) {
    console.log(err)
  }
}

async function reloadCategories(type) {
  categories.value = await fetchCategories(type)
  model.value.category_id = categories.value[0].id
}

async function saveMovement() {
  try {
    loading.value = true
    await http.post('/movements', model.value)
    dialog.value = false
    snack.value.showSnackBar('Movimentação lançada com sucesso')
    emit('submit')
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.floating-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
}
</style>
