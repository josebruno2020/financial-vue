<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer v-model="drawer" rail permanent expand-on-hover>
        <v-list>
          <v-list-item
            prepend-avatar="https://github.com/josebruno2020.png"
            title="Sandra Adams"
            subtitle="sandra_a88@gmailcom"
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
            :active="currentRoute === 'home'"
            @click="toRoute('home')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-forum"
            title="Categorias"
            value="categories"
            @click="toRoute('categories')"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>Controlador financeiro</v-app-bar-title>
      </v-app-bar>
      <v-main style="min-height: 100vh">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const drawer = ref(true)

const currentRoute = ref(null)
const route = useRoute()
const router = useRouter()

//console.log(useRoute())

function toRoute(name: string) {
  console.log(router)
  router.push({ name })
}
</script>

<style scoped>
</style>
