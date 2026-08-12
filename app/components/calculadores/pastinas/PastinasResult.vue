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
              <div class="flex flex-col md:flex-row lg:flex-col xl:flex-row md:items-center lg:items-start xl:items-center gap-1 md:gap-3 lg:gap-1 xl:gap-3">
                <p class="w-fit flex items-start gap-1 text-xl lg:text-2xl font-semibold leading-tight">
                  {{ nombreProducto }}<sup class="text-xs lg:text-base align-super">®</sup>
                </p>
                <a v-if="result.producto.url" :href="result.producto.url" target="_blank" rel="noopener"
                  class="w-fit flex items-center gap-1 border-b border-brand-red text-xs lg:text-base text-brand-red font-semibold uppercase">
                  Más info.
                  <Icon name="material-symbols:open-in-new-rounded" class="w-3.5 lg:w-4 h-3.5 lg:h-4 flex-shrink-0" />
                </a>
              </div>
            </div>
            <img v-if="result.producto.imagen" :src="result.producto.imagen" :alt="nombreProducto"
              class="w-[60px] md:w-[84px] h-[52px] md:h-[72px] object-contain flex-shrink-0 lg:hidden">
          </div>

          <div class="flex items-center gap-2 lg:gap-3">
            <img v-if="result.producto.imagen" :src="result.producto.imagen" :alt="nombreProducto"
              class="w-[102px] xxl:w-[120px] h-[88px] xxl:h-[104px] object-contain flex-shrink-0 hidden lg:block">
            <div class="flex-1 grid grid-cols-2 gap-2 lg:gap-3">
              <div class="lg:w-52 flex flex-col justify-center bg-brand-gray-mid rounded-lg p-2 lg:p-5">
                <p class="text-xs lg:text-base text-brand-gray-dark font-medium">Consumo</p>
                <p class="lg:text-2xl font-semibold">{{ result.consumo_kg_m2 }} kg/m²</p>
              </div>
              <div class="lg:w-52 flex flex-col justify-center bg-brand-gray-mid rounded-lg p-2 lg:p-5">
                <p class="text-xs lg:text-base text-brand-gray-dark font-medium">Total de pastina</p>
                <p class="lg:text-2xl font-semibold">{{ totalKgFormatted }} kg</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <p class="text-sm lg:text-base text-brand-red font-semibold uppercase">Bolsas necesarias</p>
          <div v-for="bolsa in result.bolsas" :key="bolsa.presentacion"
            class="flex justify-between items-center bg-brand-gray-mid rounded-lg p-2 lg:py-3 lg:px-5">
            <span class="text-xs lg:text-xl font-medium">Presentación de {{ bolsa.presentacion }}</span>
            <span class="lg:text-2xl text-brand-red font-bold uppercase">
              {{ bolsa.cantidad }} {{ bolsa.cantidad === 1 ? 'bolsa' : 'bolsas' }}
            </span>
          </div>
        </div>
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

const nombreProducto = computed(() =>
  props.result.producto.nombre_corto ?? props.result.producto.nombre
)

const totalKgFormatted = computed(() => {
  const total = props.result.consumo_total_kg
  // Si es menor a 1 kg mostrar con 2 decimales; si no, redondeado
  if (total < 1) return total.toFixed(2)
  if (total < 10) return total.toFixed(1)
  return total.toFixed(0)
})
</script>
