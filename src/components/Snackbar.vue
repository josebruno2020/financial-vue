<template>
  <div class="text-center">
    <v-snackbar v-model="show" :timeout="timeout">
      {{ text }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const show = ref(false)
const text = ref('')
const timeout = ref(2000)

defineExpose({
  showSnackBar
})

function showSnackBar(message: string) {
  text.value = message
  show.value = true
}
</script>
