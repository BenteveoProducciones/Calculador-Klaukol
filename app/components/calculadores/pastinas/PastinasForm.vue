<template>
  <div class="flex flex-col items-center gap-4 lg:gap-6">

    <!-- Superficie -->
    <FormNumberInput id="area-pastinas" v-model="inputs.area_m2" label="Superficie a pastinar (m²)" suffix="m²"
      placeholder="Superficie" :step="0.5" class="w-full" />

    <!-- Tipo de revestimiento -->
    <div class="w-full flex flex-col gap-1">
      <FormLabel>Tipo de revestimiento</FormLabel>
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-3">
        <label v-for="tipo in tiposRevestimiento" :key="tipo.value"
          class="h-[4.5rem] lg:h-auto flex flex-col justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg cursor-pointer transition-all duration-150 py-2 px-3"
          :class="inputs.tipo_revestimiento === tipo.value
            ? 'border-brand-red bg-brand-red text-white'
            : 'border-brand-gray-mid bg-white'">
          <input v-model="inputs.tipo_revestimiento" type="radio" :value="tipo.value" class="sr-only" />
          <span class="text-xs lg:text-base font-medium">{{ tipo.label }}</span>
          <span v-if="tipo.sublabel" class="text-xs lg:text-sm lg:mt-1"
            :class="inputs.tipo_revestimiento === tipo.value ? 'text-white/90' : 'text-brand-gray-dark'">
            {{ tipo.sublabel }}
          </span>
        </label>
      </div>
    </div>

    <!-- Sub-selector de tamaño (solo si hay más de uno) -->
    <div v-if="mostrarSelectorTamano" class="w-full flex flex-col gap-1">
      <FormLabel>{{ tipoSeleccionadoLabel }}</FormLabel>
      <div class="grid gap-2 lg:gap-3" :class="gridColsTamanos">
        <label v-for="t in tamanosDisponibles" :key="t.value"
          class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium cursor-pointer transition-all duration-150 py-2 px-3"
          :class="inputs.tamano === t.value
            ? 'border-brand-red bg-brand-red text-white'
            : 'border-brand-gray-mid bg-white'">
          <input v-model="inputs.tamano" type="radio" :value="t.value" class="sr-only" />
          {{ t.label }}
        </label>
      </div>
    </div>

    <!-- Ubicación -->
    <div class="w-full flex flex-col gap-1">
      <FormLabel>Ubicación</FormLabel>
      <div class="grid grid-cols-2 gap-2 lg:gap-3">
        <label v-for="op in ubicaciones" :key="op.value"
          class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium cursor-pointer transition-all duration-150 py-2 px-3"
          :class="inputs.ubicacion === op.value
            ? 'border-brand-red bg-brand-red text-white'
            : 'border-brand-gray-mid bg-white'">
          <input v-model="inputs.ubicacion" type="radio" :value="op.value" class="sr-only" />
          {{ op.label }}
        </label>
      </div>
    </div>

    <!-- Losa radiante -->
    <div class="w-full flex flex-col gap-1">
      <FormLabel>Losa radiante</FormLabel>
      <div class="grid grid-cols-2 gap-2 lg:gap-3">
        <label v-for="op in [{ label: 'Sí', value: true }, { label: 'No', value: false }]" :key="String(op.value)"
          class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium cursor-pointer transition-all duration-150 py-2 px-3"
          :class="inputs.losa_radiante === op.value
            ? 'border-brand-red bg-brand-red text-white'
            : 'border-brand-gray-mid bg-white'">
          <input v-model="inputs.losa_radiante" type="radio" :value="op.value" class="sr-only" />
          {{ op.label }}
        </label>
      </div>
    </div>

    <!-- Ancho de junta -->
    <div class="w-full flex flex-col gap-1">
      <FormLabel>Ancho de junta (mm)</FormLabel>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        <label v-for="j in anchosJunta" :key="j.value"
          class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium cursor-pointer transition-all duration-150 py-2 px-3"
          :class="inputs.ancho_junta === j.value
            ? 'border-brand-red bg-brand-red text-white'
            : 'border-brand-gray-mid bg-white'">
          <input v-model="inputs.ancho_junta" type="radio" :value="j.value" class="sr-only" />
          {{ j.label }}
        </label>
      </div>
    </div>

    <div class="w-full flex justify-center mt-2 lg:mt-6">
      <button :disabled="!isValid"
        class="w-full max-w-[25rem] h-12 flex justify-center items-center rounded-lg lg:text-2xl uppercase text-white font-semibold"
        :class="isValid
          ? 'bg-brand-red'
          : 'bg-brand-red/60 cursor-not-allowed'" @click="calcular">
        Calcular
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePastinas, TIPOS_REVESTIMIENTO, ANCHOS_JUNTA } from '~/composables/usePastinas'

const emit = defineEmits(['calculated'])

const { inputs, result, isValid, tamanosDisponibles, mostrarSelectorTamano } = usePastinas()

const tiposRevestimiento = TIPOS_REVESTIMIENTO
const anchosJunta = ANCHOS_JUNTA

const ubicaciones = [
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
]

const tipoSeleccionadoLabel = computed(() => {
  const t = TIPOS_REVESTIMIENTO.find(t => t.value === inputs.tipo_revestimiento)
  return t?.label ?? ''
})

// Grid columns dinámico según cantidad de tamaños
const gridColsTamanos = computed(() => {
  const count = tamanosDisponibles.value.length
  if (count <= 2) return 'grid-cols-2'
  if (count <= 4) return 'grid-cols-2 lg:grid-cols-4'
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
})

function calcular() {
  if (!isValid.value) return
  emit('calculated', result.value)
}
</script>
