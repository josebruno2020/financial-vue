<template>
  <main>
    <h2 class="text-center mb-3">Categorias 💰</h2>

    <section>
      <div v-for="(category, i) in categories" :key="i">
        {{ category.name }}
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { createAxios } from '@/services/http'
import { onMounted, ref } from 'vue'
import type { Category } from '@/models/Category'
import { categoriesMixin } from '@/mixins/categoriesMixin'

const { fetchCategories } = categoriesMixin()
const http = createAxios()
const categories = ref<Category[]>([])

onMounted(async () => {
  categories.value = await fetchCategories()
})

</script>