<template>
  <div class="min-h-screen bg-white">

    <div class="h-80 lg:h-[30rem] overflow-hidden">
      <img :src="heroImage" class="w-full h-full object-cover object-bottom transition-opacity duration-300"
        alt="Obra en construcción" />
    </div>

    <section class="relative z-10 -mt-12">
      <div class="md:max-w-[60.75rem] lg:max-w-[75rem] bg-white rounded-t-2xl md:rounded-t-3xl md:mx-auto">
        <div class="lg:flex lg:flex-col lg:gap-1 text-center py-4 lg:py-8 px-5">
          <p class="flex md:inline flex-col md:flex-row text-2xl lg:text-4xl font-semibold uppercase leading-tight text-brand-red">
            Calculá el material <span>para tu obra</span>
          </p>
          <p class="text-xs lg:text-xl font-medium">
            Ingresá los datos de tu proyecto y conocé qué producto usar y la cantidad.
          </p>
        </div>

        <TabSwitcher v-model="activeTab" />
        <div class="w-full py-6 px-5 md:px-16 lg:px-6 xxl:px-0">
          <template v-if="!currentResult">
            <div v-show="activeTab === 'adhesivos'">
              <AdhesivosForm @calculated="onCalculated" />
            </div>
            <div v-show="activeTab === 'morteros'">
              <MorterosForm @calculated="onCalculated" />
            </div>
            <div v-show="activeTab === 'pastinas'">
              <PastinasForm @calculated="onCalculated" />
            </div>
          </template>
          <template v-else>
            <AdhesivosResult v-if="activeTab === 'adhesivos'" :result="currentResult" @recalcular="recalcular" />
            <MorterosResult v-if="activeTab === 'morteros'" :result="currentResult" @recalcular="recalcular" />
            <PastinasResult v-if="activeTab === 'pastinas'" :result="currentResult" @recalcular="recalcular" />
            <Disclaimers :tipo="activeTab" />
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const activeTab = ref('adhesivos')
const currentResult = ref(null)

function onCalculated(result) {
  currentResult.value = result
}

function recalcular() {
  currentResult.value = null
}

watch(activeTab, () => {
  currentResult.value = null
})

const HERO_IMAGES = {
  adhesivos: '/images/hero/Adhesivos-S.png',
  morteros: '/images/hero/morteros.webp',
  pastinas: '/images/hero/pastinas.webp',
}

const heroImage = computed(() => HERO_IMAGES[activeTab.value] ?? HERO_IMAGES.adhesivos)
</script>
