<template>
  <div class="flex flex-col gap-6 lg:gap-12">

    <!-- Incompatible -->
    <div v-if="result.incompatible" class="border-2 border-brand-red rounded-xl overflow-hidden">
      <div class="p-3 lg:p-6">
        <p class="text-sm lg:text-base font-semibold uppercase tracking-widest text-brand-red">
          Producto recomendado
        </p>
        <p class="text-2xl lg:text-4xl font-semibold leading-tight mt-1">
          {{ result.mensaje }}
        </p>
      </div>
    </div>

    <!-- Resultado normal -->
    <div v-else class="border-2 border-brand-red rounded-xl overflow-hidden">
      <div class="flex flex-col gap-3 lg:gap-6 p-3 lg:p-6">
        <div class="flex flex-col lg:flex-row lg:justify-between gap-2">
          <div class="lg:flex lg:flex-col lg:gap-1">
            <p class="text-sm lg:text-base font-semibold uppercase tracking-widest text-brand-red">
              Producto recomendado
            </p>
            <p class="text-2xl lg:text-4xl font-semibold leading-tight">
              {{ result.producto.nombre }}<sup class="text-xs lg:text-xl align-super">®</sup>
            </p>
          </div>

          <div class="grid grid-cols-2 gap-2 lg:gap-3">
            <div class="lg:w-52 lg:h-fit flex flex-col lg:justify-center bg-brand-gray-mid rounded-lg p-2 lg:p-5">
              <p class="text-xs lg:text-base text-brand-gray-dark font-medium">Consumo</p>
              <p class="lg:text-2xl font-semibold">{{ result.consumo_min }} - {{ result.consumo_max }} kg/m²</p>
            </div>
            <div class="lg:w-52 lg:h-fit flex flex-col lg:justify-center bg-brand-gray-mid rounded-lg p-2 lg:p-5">
              <p class="text-xs lg:text-base text-brand-gray-dark font-medium">Total</p>
              <p class="lg:text-2xl font-semibold">{{ result.consumo_total_min.toFixed(0) }} - {{ result.consumo_total_max.toFixed(0) }} kg</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <p class="text-sm lg:text-base text-brand-red font-semibold uppercase">Bolsas necesarias</p>
          <div class="flex justify-between items-center flex-wrap gap-2 bg-brand-gray-mid rounded-lg p-2 lg:py-3 lg:px-5">
            <span class="text-xs lg:text-xl font-medium">Presentación de 25kg</span>
            <span class="lg:text-2xl text-brand-red font-bold uppercase">
              <template v-if="result.bolsas_min === result.bolsas_max">
                {{ result.bolsas_min }} {{ result.bolsas_min === 1 ? 'bolsa' : 'bolsas' }}
              </template>
              <template v-else>
                {{ result.bolsas_min }} a {{ result.bolsas_max }} bolsas
              </template>
            </span>
          </div>
        </div>

        <div v-if="result.comentario" class="flex flex-col gap-1 lg:gap-2">
          <p class="text-sm lg:text-base text-brand-red font-semibold uppercase">Observación</p>
          <p class="bg-brand-gray-mid rounded-lg text-xs lg:text-xl font-medium p-2 lg:py-3 lg:px-5">{{ result.comentario }}</p>
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
defineProps({
  result: {
    type: Object,
    required: true,
  },
})

defineEmits(['recalcular'])
</script>