<template>
  <v-container fluid>
    <h2 class="text-center mt-3">Login</h2>

    <div class="mt-3">
      <v-form @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="model.email"
                type="email"
                label="E-mail"
                hide-details
                required
                autofocus
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field
                v-model="model.password"
                label="Senha"
                type="password"
                hide-details
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-btn type="submit" block color="primary" class="mt-2" :loading="loading"
                >Entrar
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>

    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { createAxios } from '@/services/http'
import { Login } from '@/models/Login'
import { ref } from 'vue'
import { storageService } from '@/services/storage'
import { useRouter } from 'vue-router'
import Snackbar from '@/components/Snackbar.vue'

const http = createAxios()
const model = ref<Login>({})
const router = useRouter()
const loading = ref(false)
const snackbar = ref()

async function submit() {
  loading.value = true
  try {
    const { data } = await http.post('/auth/login', model.value)
    const token = data.data.token
    storageService.set('token', token)
    storageService.set('user', data.data.user)

    await router.push({ name: 'home' })
  } catch (err) {
    snackbar.value.showSnackBar('E-mail e/ou senha inválido.')
  } finally {
    loading.value = false
  }
}
</script>
