<template>
  <v-container fluid>
    <h2 class="text-center mb-3">Sua vida financeira em um só lugar 💰</h2>

    <v-row>
      <v-col cols="12" sm="12" md="4">
        <v-text-field type="month" v-model="month" @input="changeMonth"></v-text-field>
      </v-col>
    </v-row>

    <v-card
      class="mx-auto"
      prepend-icon="mdi-currency-usd"
      @click="clickOnMainCard"
      variant="tonal"
      color="primary"
    >
      <template v-slot:title> Seu saldo <strong>total</strong> até agora:</template>
      <v-card-text>
        <p class="balance">{{ formatCurrency(balance) }}</p></v-card-text
      >
    </v-card>

    <h3 class="my-4" v-if="monthTotals.length">Totais no mês</h3>

    <div class="month-totals" v-if="monthTotals.length">
      <v-card
        class="mx-auto"
        min-width="300"
        prepend-icon="mdi-arrow-down"
        @click="clickTotalCard(0)"
        color="success"
        variant="tonal"
      >
        <template v-slot:title>Total entradas:</template>
        <v-card-text>
          <p class="balance">{{ formatCurrency(monthTotals[0].total) }}</p></v-card-text
        >
      </v-card>

      <v-card
        class="mx-auto"
        min-width="300"
        prepend-icon="mdi-arrow-up"
        @click="clickTotalCard(1)"
        color="warning"
        variant="tonal"
      >
        <template v-slot:title>Total Saídas:</template>
        <v-card-text>
          <p v-if="monthTotals.length" class="balance">
            {{ formatCurrency(monthTotals[1].total) }}
          </p>
        </v-card-text>
      </v-card>
    </div>

    <h3 class="my-4" v-if="!loading">Gastos por Categoria</h3>

    <v-sheet class="totals" elevation="8">
      <v-slide-group show-arrows class="pa-4">
        <v-slide-group-item v-for="({ name, total, id }, index) in totals" :key="index">
          <v-card
            width="200"
            color="grey-lighten-1"
            :class="['ma-4']"
            @click="clickOnListCard(id)"
            variant="tonal"
          >
            <template v-slot:title>{{ name }}</template>
            <v-card-text
              ><p class="balance">{{ formatCurrency(total) }}</p></v-card-text
            >
          </v-card>
        </v-slide-group-item>
        <v-card-text v-if="!totals.length && !loading">Nenhum registro encontrado</v-card-text>
      </v-slide-group>
    </v-sheet>

    <v-progress-linear color="blue-lighten-3" indeterminate v-if="loading"></v-progress-linear>

    <h3 class="my-4" v-if="!loading">Entradas por Categoria</h3>

    <v-sheet class="totals" elevation="8">
      <v-slide-group show-arrows class="pa-4">
        <v-slide-group-item v-for="({ name, total, id }, index) in inflowTotals" :key="index">
          <v-card
            width="200"
            color="grey-lighten-1"
            :class="['ma-4']"
            @click="clickOnListCard(id)"
            variant="tonal"
          >
            <template v-slot:title>{{ name }}</template>
            <v-card-text
              ><p class="balance">{{ formatCurrency(total) }}</p></v-card-text
            >
          </v-card>
        </v-slide-group-item>
        <v-card-text v-if="!inflowTotals.length && !loading"
          >Nenhum registro encontrado</v-card-text
        >
      </v-slide-group>
    </v-sheet>

    <new-movement :dialog="modalShow" @submit="reloadInfo"></new-movement>
  </v-container>
</template>

<script lang="ts" setup>
import { createAxios } from '@/services/http'
import { onMounted, ref } from 'vue'
import NewMovement from '@/components/NewMovement.vue'
import { useRouter } from 'vue-router'
import { currencyMixin } from '@/mixins/currencyMixin'
import type { CategoryTotal } from '@/models/CategoryTotal'
import type { MonthTotal } from '@/models/MonthTotal'
import { format } from 'date-fns'
import { storageService } from '@/services/storage'
import { movementService } from '@/services/movement'

const http = createAxios()
const month = ref(getMonth())
const balance = ref(0)
const totals = ref<CategoryTotal[]>([])
const inflowTotals = ref<CategoryTotal[]>([])
const monthTotals = ref<MonthTotal[]>([])
const modalShow = ref(false)
const router = useRouter()
const loading = ref(true)

const { formatCurrency } = currencyMixin()

onMounted(() => {
  reloadInfo()
})

function getMonth(): string {
  const monthMemory = storageService.get('month')
  return monthMemory ?? format(new Date(), 'yyyy-MM')
}

function changeMonth() {
  storageService.set('month', month.value)
  reloadInfo()
}

function reloadInfo() {
  loading.value = true
  Promise.all([fetchBalance(), fetchTotals(), fetchInflowTotals(), fetchMonthTotals()]).finally(
    () => (loading.value = false)
  )
}

async function fetchBalance() {
  try {
    const { data } = await http.get('/balances')
    balance.value = data.data?.balance
  } catch (err) {
    console.log(err)
  }
}

async function fetchTotals() {
  totals.value = await movementService.fetchTotalsCategory()
}

async function fetchInflowTotals() {
  inflowTotals.value = await movementService.fetchTotalsCategory(0)
}

async function fetchMonthTotals() {
  monthTotals.value = await movementService.fetchMonthTotals()
}

function clickOnMainCard() {
  router.push({ name: 'movements' })
}

function clickTotalCard(type: number) {
  router.push({
    name: 'movements',
    query: { type }
  })
}

function clickOnListCard(categoryId: number) {
  router.push({
    name: 'movements',
    query: { category: categoryId }
  })
}
</script>

<style>
.month-totals {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.totals {
  margin-top: 0.3rem;
}

.balance {
  font-size: 1.8rem;
  font-weight: bold;
}
</style>
