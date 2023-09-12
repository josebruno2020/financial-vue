<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        rail
        permanent
        expand-on-hover
        v-if="currentRoute !== 'login'"
      >
        <v-list>
          <v-list-item
            v-if="loggedUser"
            prepend-avatar="https://github.com/josebruno2020.png"
            :title="loggedUser.name"
            :subtitle="loggedUser.email"
          >
            <template v-slot:append>
              <v-btn variant="text" icon="mdi-chevron-left" @click.stop="drawer = !drawer"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            title="Home"
            value="home"
            :active="currentRoute == 'home'"
            @click="toRoute('home')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="Categorias"
            value="categories"
            :active="currentRoute == 'categories'"
            @click="toRoute('categories')"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>Controlador financeiro</v-app-bar-title>

        <template v-slot:append v-if="currentRoute !== 'login'">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title class="item-button " @click="logout">Sair
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-app-bar>
      <v-main style="min-height: 100vh">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storageService } from '@/services/storage'

const drawer = ref(true)

const route = useRoute()
const currentRoute = ref('')
const router = useRouter()
const loggedUser = ref(null)

watch(route, (to) => {
  currentRoute.value = to.name
  if (currentRoute.value !== 'login' && !loggedUser.value) {
    getUser()
  }
})

onMounted(() => getUser())

function getUser() {
  loggedUser.value = storageService.get('user')
}

function toRoute(name: string) {
  currentRoute.value = name
  router.push({ name })
}

function logout() {
  storageService.remove('user')
  storageService.remove('token')
  storageService.remove('month')
  storageService.remove('group')
  router.push({ name: 'login' })
}
</script>

<style>
.floating-button {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
}

.item-button {
  cursor: pointer;
}
</style>
