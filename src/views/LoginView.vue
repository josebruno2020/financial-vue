<template>
  <main>
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
              <v-btn type="submit" block color="primary" class="mt-2">Entrar</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { createAxios } from '@/services/http'
import { Login } from '@/models/Login'
import { ref } from 'vue'
import { storageService } from '@/services/storage'
import { useRouter } from 'vue-router'

const http = createAxios()
const model = ref<Login>({
  email: 'josebrunocampanholi@gmail.com'
})
const router = useRouter()

async function submit() {
  try {
    const { data } = await http.post('/auth/login', model.value)
    const token = data.data.token
    storageService.set('token', token)
    storageService.set('user', data.data.user)

    router.push({ name: 'home' })
  } catch (err) {
    console.log(err)
    alert('Login inválido')
  }
}
</script>
