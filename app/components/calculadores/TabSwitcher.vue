<template>
  <div class="flex justify-center items-center pb-4 lg:pb-8">
    <button v-for="tab in tabs" :key="tab.id" :disabled="tab.disabled"
      class="bg-brand-gray-mid whitespace-nowrap lg:transition-all lg:duration-200 outline-none cursor-pointer first:ml-5 md:first:ml-0 first:rounded-l-xl last:mr-5 md:last:mr-0 last:rounded-r-xl p-2"
      @click="!tab.disabled && $emit('update:modelValue', tab.id)">
      <div class="rounded-lg text-sm lg:text-xl font-semibold uppercase tracking-wider py-2 md:py-3 lg:py-2 px-4 md:px-8 lg:px-16" :class="[
        tab.disabled
          ? 'text-gray-300 cursor-not-allowed'
          : modelValue === tab.id
            ? 'bg-brand-red text-white'
            : 'text-brand-gray-dark',
      ]">
        {{ tab.label }}
      </div>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])

const tabs = [
  { id: 'adhesivos', label: 'Adhesivos' },
  { id: 'morteros', label: 'Morteros' },
  { id: 'pastinas', label: 'Pastinas' },
]
</script>
