<template>
  <v-container fluid>
    <h2 class="text-center mb-3">Movimentações</h2>

    <v-row>
      <v-col cols="12">
        <v-progress-linear color="blue-lighten-3" indeterminate v-if="loading"></v-progress-linear>
        <v-list>
          <v-list-item v-for="movement in movements" :key="movement.id" class="px-0">
            <v-card
              density="compact"
              :color="movement.type === 0 ? 'success' : 'warning'"
              variant="tonal"
              elevation="5"
            >
              <v-card-title class="text-h5"
                >{{ formatCurrency(movement.value) }} -
                {{ formatMovementStatus(movement.status) }}
              </v-card-title>
              <v-card-subtitle>{{ formatDate(movement.date) }}</v-card-subtitle>

              <v-card-text class="text pt-4 pb-0">
                {{ movement.obs }}
              </v-card-text>

              <v-card-actions>
                <v-list-item class="w-100 px-2">
                  <v-list-item-title>{{ movement.category.name }}</v-list-item-title>

                  <v-list-item-subtitle>{{ movement.paymentForm.name }}</v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="justify-self-end">
                      <v-btn
                        icon="mdi-trash-can"
                        @click="confirmDeleteMovement(movement.id)"
                      ></v-btn>
                      <v-btn icon="mdi-pencil"></v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <confirm-dialog ref="confirm" @accept="deleteMovement"></confirm-dialog>

    <snackbar ref="snack"></snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createAxios } from '@/services/http'
import type { Movement } from '@/models/Movement'
import { currencyMixin } from '@/mixins/currencyMixin'
import { useRoute } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Snackbar from '@/components/Snackbar.vue'

const http = createAxios()
const route = useRoute()
const movements = ref<Movement[]>([])
const categoryId = ref(route.query.category)
const type = ref(route.query.type)
const id = ref(null)
const loading = ref(true)

const confirm = ref()
const snack = ref()

const { formatCurrency } = currencyMixin()

onMounted(() => {
  fetchMovements().finally(() => (loading.value = false))
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function formatMovementStatus(status: string): string {
  if (status === 'scheduled') return 'Agendado'
  if (status === 'paid') return 'Pago'
  if (status === 'recieved') return 'Recebido'

  return ''
}

async function fetchMovements() {
  try {
    const { data } = await http.get(
      `/movements/current-month?category_id=${categoryId.value}&type=${type.value}`
    )
    movements.value = data.data
  } catch (err) {
    console.log(err)
  }
}

function confirmDeleteMovement(movementId: number) {
  id.value = movementId
  confirm.value.openDialog()
}

async function deleteMovement() {
  try {
    await http.delete(`/movements/${id.value}`)
    fetchMovements()
    snack.value.showSnackBar('Movimentação removida com sucesso!')
  } catch (err) {
    console.log(err)
  }
}
</script>
