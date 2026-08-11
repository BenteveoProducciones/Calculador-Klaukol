<template>
  <div class="flex flex-col items-center gap-4 lg:gap-6">
    <div class="w-full flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
      <FormNumberInput id="area" v-model="inputs.area_m2" label="Superficie a revestir (m²)" suffix="m²"
        placeholder="Superficie" :step="0.5" />
      <FormNumberInput id="largo" v-model="inputs.largo_cm" label="Largo de la pieza (cm)" suffix="cm"
        placeholder="Largo" />
      <FormNumberInput id="ancho" v-model="inputs.ancho_cm" label="Ancho de la pieza (cm)" suffix="cm"
        placeholder="Ancho" />
    </div>
    <div class="w-full flex flex-col gap-1">
      <FormLabel>Tipo de pieza</FormLabel>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        <label v-for="tipo in tiposPieza" :key="tipo.value"
          class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium cursor-pointer transition-all duration-150 py-2 px-3"
          :class="inputs.tipo_pieza === tipo.value
            ? 'border-brand-red bg-brand-red text-white'
            : 'border-brand-gray-mid bg-white'">
          <input v-model="inputs.tipo_pieza" type="radio" :value="tipo.value" class="sr-only" />
          {{ tipo.label }}
        </label>
      </div>
    </div>

    <div class="w-full flex flex-col gap-1">
      <FormLabel>Tipo de superficie de colocación</FormLabel>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        <label v-for="sup in superficies" :key="sup.key"
          class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium transition-all duration-150 py-2 px-3"
          :class="[
            estaDeshabilitada(sup.key)
              ? 'border-brand-gray-mid bg-brand-gray-mid text-brand-gray-dark/50 cursor-not-allowed'
              : 'cursor-pointer',
            !estaDeshabilitada(sup.key) && inputs[sup.key]
              ? 'border-brand-red bg-brand-red text-white'
              : '',
            !estaDeshabilitada(sup.key) && !inputs[sup.key]
              ? 'border-brand-gray-mid bg-white'
              : ''
          ]">
          <input v-model="inputs[sup.key]" type="checkbox" :disabled="estaDeshabilitada(sup.key)" class="sr-only" />
          {{ sup.label }}
        </label>
      </div>
    </div>

    <div class="w-full flex flex-col lg:flex-row gap-4">
      <div class="lg:w-1/2 flex flex-col gap-1">
        <FormLabel>Losa radiante</FormLabel>
        <div class="grid grid-cols-2 gap-2 lg:gap-3">
          <label v-for="op in [{ label: 'Sí', value: true }, { label: 'No', value: false }]" :key="String(op.value)"
            class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium cursor-pointer transition-all duration-150 py-2 px-3"
            :class="inputs.losas_radiantes === op.value
              ? 'border-brand-red bg-brand-red text-white'
              : 'border-brand-gray-mid bg-white'">
            <input v-model="inputs.losas_radiantes" type="radio" :value="op.value" class="sr-only" />
            {{ op.label }}
          </label>
        </div>
      </div>

      <div class="w-full lg:w-1/2 flex flex-col gap-1">
        <FormLabel>Condición</FormLabel>
        <div class="grid grid-cols-2 gap-2 lg:gap-3">
          <label v-for="op in [{ label: 'Interior', value: false }, { label: 'Exterior', value: true }]"
            :key="String(op.value)"
            class="flex justify-center items-center text-center border-2 border-brand-gray-mid rounded-lg text-xs lg:text-base font-medium cursor-pointer transition-all duration-150 py-2 px-3"
            :class="inputs.exterior === op.value
              ? 'border-brand-red bg-brand-red text-white'
              : 'border-brand-gray-mid bg-white'">
            <input v-model="inputs.exterior" type="radio" :value="op.value" class="sr-only" />
            {{ op.label }}
          </label>
        </div>
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
import { watch } from 'vue'
import { useAdhesivos } from '~/composables/useAdhesivos'

const emit = defineEmits(['calculated'])

const { inputs, result, isValid } = useAdhesivos()

const tiposPieza = [
  { value: 'porcelanato', label: 'Porcelanato' },
  { value: 'ceramico', label: 'Cerámico' },
  { value: 'venecitas', label: 'Venecitas / Piezas traslúcidas' },
  { value: 'ladrillo_refractario', label: 'Ladrillo refractario' },
]

const superficies = [
  { key: 'placa_de_yeso', label: 'Placa de yeso' },
  { key: 'sobre_piso_existente', label: 'Sobre cerámico o porcelanato existente' },
  { key: 'superficie_de_madera', label: 'Madera' },
  { key: 'carpeta', label: 'Carpeta / Revoque' },
]

const SUPERFICIES_ANULADAS_POR_REFRACTARIO = ['placa_de_yeso', 'sobre_piso_existente', 'superficie_de_madera']

function estaDeshabilitada(key) {
  return inputs.tipo_pieza === 'ladrillo_refractario' && SUPERFICIES_ANULADAS_POR_REFRACTARIO.includes(key)
}

watch(() => inputs.tipo_pieza, (tipo) => {
  if (tipo !== 'ladrillo_refractario') return
  SUPERFICIES_ANULADAS_POR_REFRACTARIO.forEach(key => { inputs[key] = false })
})

function calcular() {
  if (!isValid.value) return
  emit('calculated', result.value)
}
</script>
