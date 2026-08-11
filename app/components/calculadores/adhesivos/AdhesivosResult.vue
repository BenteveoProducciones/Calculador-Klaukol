<template>
  <div class="flex flex-col gap-6 lg:gap-12">

    <div class="border-2 border-brand-red rounded-xl overflow-hidden">
      <div class="flex flex-col gap-3 lg:gap-6 p-3 lg:p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div class="flex justify-between items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
            <div class="flex flex-col gap-1">
              <p class="text-sm lg:text-base font-semibold uppercase tracking-widest text-brand-red">
                Producto recomendado
              </p>
              <p class="w-fit flex items-start gap-1 text-xl lg:text-2xl font-semibold leading-tight">
                {{ result.producto.nombre }}<sup class="text-xs lg:text-base align-super">®</sup>
              </p>
            </div>
            <img v-if="result.producto.imagen" :src="result.producto.imagen" :alt="result.producto.nombre"
              class="w-[60px] md:w-[84px] h-[52px] md:h-[72px] object-contain flex-shrink-0 lg:hidden">
          </div>

          <div class="flex items-center gap-2 lg:gap-3">
            <img v-if="result.producto.imagen" :src="result.producto.imagen" :alt="result.producto.nombre"
              class="w-[102px] xxl:w-[120px] h-[88px] xxl:h-[104px] object-contain flex-shrink-0 hidden lg:block">
            <div class="flex-1 grid grid-cols-2 gap-2 lg:gap-3">
              <div class="lg:w-52 flex flex-col justify-center bg-brand-gray-mid rounded-lg p-2 lg:p-5">
                <p class="text-xs lg:text-base text-brand-gray-dark font-medium">Consumo</p>
                <p class="lg:text-2xl font-semibold">{{ result.consumo_kg_m2 }} kg/m²</p>
              </div>
              <div class="lg:w-52 flex flex-col justify-center bg-brand-gray-mid rounded-lg p-2 lg:p-5">
                <p class="text-xs lg:text-base text-brand-gray-dark font-medium">Total</p>
                <p class="lg:text-2xl font-semibold">{{ result.consumo_total_kg.toFixed(0) }} kg</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <p class="text-sm lg:text-base text-brand-red font-semibold uppercase">{{ unidadPlural }} necesarios</p>
          <div v-for="bolsa in result.bolsas" :key="bolsa.presentacion"
            class="flex justify-between items-center bg-brand-gray-mid rounded-lg p-2 lg:py-3 lg:px-5">
            <span class="text-xs lg:text-xl font-medium">Presentación de {{ bolsa.presentacion }}</span>
            <span class="lg:text-2xl text-brand-red font-bold uppercase">
              {{ bolsa.cantidad }} {{ unidadPlural }}
            </span>
          </div>
        </div>

        <div v-if="result.doble_encolado || result.comentario" class="flex flex-col gap-1 lg:gap-2">
          <p class="text-sm lg:text-base text-brand-red font-semibold uppercase">Recomendación</p>
          <p v-if="result.doble_encolado"
            class="bg-brand-gray-mid rounded-lg text-xs lg:text-xl font-medium p-2 lg:py-3 lg:px-5">
            Se recomienda
            aplicar doble untado</p>
          <p v-if="result.comentario"
            class="bg-brand-gray-mid rounded-lg text-xs lg:text-xl font-medium p-2 lg:py-3 lg:px-5">{{
              result.comentario
            }}</p>
        </div>
      </div>

      <!-- <div class="bg-brand-red/60 text-center py-2 px-3">
        <p class="text-sm font-semibold uppercase !leading-5">
          ¡No olvides la pastina! Ingresá al
          <a href="#" class="text-white underline">calculador de pastinas</a>
          y asegurá cuánto necesitás
        </p>
      </div> -->
    </div>

    <div v-if="result.llana" class="flex flex-col gap-1">
      <p class="text-sm lg:text-base text-brand-red font-semibold uppercase">Llana recomendada</p>
      <div
        class="bg-brand-gray-mid rounded-lg lg:text-center text-xs lg:text-base font-medium py-2 lg:py-3 px-3 lg:px-5">
        <p>Usá una llana de <span class="text-brand-red">{{ llanaTexto }}</span>{{ result.llana_rango ? ` en piezas
          hasta ${result.llana_rango}` : '' }}</p>
      </div>
    </div>

    <div class="flex flex-col items-center gap-3 lg:gap-6">
      <a href="https://arg.sika.com/klaukol/es/puntos-ventas-klaukol.html" target="_blank" rel="noopener"
        class="flex flex-col md:flex-row items-center gap-2 bg-brand-red rounded-lg text-center lg:text-2xl text-white font-semibold uppercase p-2 md:px-12 lg:px-8">
        ¿Ya sabés lo que necesitás? Encontrá donde comprarlo
        <Icon name="material-symbols:arrow-right-alt-rounded" class="w-6 lg:w-8 h-6 lg:h-8 flex-shrink-0" />
      </a>

      <button
        class="h-12 flex items-center gap-2 border-2 border-brand-red rounded-lg lg:text-xl text-brand-red font-semibold uppercase cursor-pointer py-1.5 px-6"
        @click="$emit('recalcular')">
        <Icon name="material-symbols:sync-rounded" class="w-4 lg:w-6 h-4 lg:h-6 flex-shrink-0" />
        Recalcular
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
})

defineEmits(['recalcular'])

const unidadPlural = computed(() =>
  props.result.producto.unidad === 'balde' ? 'baldes' : 'bolsas'
)

const llanaTexto = computed(() => props.result.llana?.replace('×', 'x') ?? '')
</script>
