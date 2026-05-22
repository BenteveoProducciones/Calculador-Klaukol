import { reactive, computed, watch } from 'vue'
import { PRODUCTOS } from '~/constants/productos'

// Tipos de revestimiento + tamaños disponibles + absorción inferida
export const TIPOS_REVESTIMIENTO = [
  {
    value: 'mosaico_veneciano',
    label: 'Mosaico veneciano',
    absorcion: 'baja',
    tamanos: [
      { value: '2x2', label: '2x2 cm' },
      { value: '5x5', label: '5x5 cm' },
    ],
  },
  {
    value: 'gres_ceramico',
    label: 'Gres cerámico',
    absorcion: 'baja',
    tamanos: [
      { value: '10x10', label: '10x10 cm' },
      { value: '8x16', label: '8x16 cm' },
    ],
  },
  {
    value: 'azulejo',
    label: 'Azulejo',
    sublabel: '15x15 cm',
    absorcion: 'alta',
    tamanos: [{ value: '15x15', label: '15x15 cm' }],
  },
  {
    value: 'ceramica_esmaltada',
    label: 'Cerámica esmaltada',
    sublabel: '20x20 cm',
    absorcion: 'alta',
    tamanos: [{ value: '20x20', label: '20x20 cm' }],
  },
  {
    value: 'porcellanato',
    label: 'Porcellanato',
    absorcion: 'baja',
    tamanos: [
      { value: '30x30', label: '30x30 cm' },
      { value: '40x40', label: '40x40 cm' },
      { value: '50x50', label: '50x50 cm' },
      { value: '60x60', label: '60x60 cm' },
      { value: '70x70', label: '70x70 cm' },
      { value: '80x80', label: '80x80 cm' },
    ],
  },
]

export const ANCHOS_JUNTA = [
  { value: 2, label: '2 mm' },
  { value: 3, label: '3 mm' },
  { value: 5, label: '5 mm' },
  { value: 10, label: '10 mm' },
]

// Tabla de consumos kg/m² indexada por [tipo][tamano][junta_mm]
const CONSUMO_TABLE = {
  mosaico_veneciano: {
    '2x2': { 2: 1.67, 3: 2.51, 5: 4.18, 10: 8.36 },
    '5x5': { 2: 0.67, 3: 1.01, 5: 1.68, 10: 3.35 },
  },
  gres_ceramico: {
    '10x10': { 2: 0.50, 3: 0.75, 5: 1.25, 10: 2.51 },
    '8x16': { 2: 0.63, 3: 0.94, 5: 1.57, 10: 3.14 },
  },
  azulejo: {
    '15x15': { 2: 0.22, 3: 0.33, 5: 0.56, 10: 1.12 },
  },
  ceramica_esmaltada: {
    '20x20': { 2: 0.38, 3: 0.66, 5: 0.96, 10: 1.92 },
  },
  porcellanato: {
    '30x30': { 2: 0.30, 3: 0.52, 5: 0.76, 10: 1.53 },
    '40x40': { 2: 0.22, 3: 0.39, 5: 0.57, 10: 1.15 },
    '50x50': { 2: 0.15, 3: 0.26, 5: 0.38, 10: 0.76 },
    '60x60': { 2: 0.15, 3: 0.26, 5: 0.38, 10: 0.76 },
    '70x70': { 2: 0.15, 3: 0.26, 5: 0.38, 10: 0.76 },
    '80x80': { 2: 0.15, 3: 0.26, 5: 0.38, 10: 0.76 },
  },
}

// Reglas de selección: Fluida PN solo si absorción alta + interior + sin losa radiante
function getProducto(tipo, ubicacion, losaRadiante) {
  const tipoConfig = TIPOS_REVESTIMIENTO.find(t => t.value === tipo)
  if (!tipoConfig) return PRODUCTOS.PASTINA_AP

  if (losaRadiante) return PRODUCTOS.PASTINA_AP

  if (tipoConfig.absorcion === 'alta' && ubicacion === 'interior') {
    return PRODUCTOS.PASTINA_FLUIDA_PN
  }

  return PRODUCTOS.PASTINA_AP
}

export function usePastinas() {
  const inputs = reactive({
    tipo_revestimiento: null,
    tamano: null,
    ubicacion: null,
    losa_radiante: null,
    ancho_junta: null,
    area_m2: null,
  })

  // Si cambia el tipo de revestimiento, resetear el tamaño (o autoseleccionar si es único)
  watch(() => inputs.tipo_revestimiento, (nuevo) => {
    const tipoConfig = TIPOS_REVESTIMIENTO.find(t => t.value === nuevo)
    if (!tipoConfig) {
      inputs.tamano = null
      return
    }
    if (tipoConfig.tamanos.length === 1) {
      inputs.tamano = tipoConfig.tamanos[0].value
    } else {
      inputs.tamano = null
    }
  })

  const tamanosDisponibles = computed(() => {
    const tipoConfig = TIPOS_REVESTIMIENTO.find(t => t.value === inputs.tipo_revestimiento)
    return tipoConfig?.tamanos ?? []
  })

  // Mostrar selector de tamaño solo si hay más de uno
  const mostrarSelectorTamano = computed(() => tamanosDisponibles.value.length > 1)

  const isValid = computed(() =>
    inputs.tipo_revestimiento !== null &&
    inputs.tamano !== null &&
    inputs.ubicacion !== null &&
    inputs.losa_radiante !== null &&
    inputs.ancho_junta !== null &&
    (inputs.area_m2 ?? 0) > 0
  )

  const result = computed(() => {
    if (!isValid.value) return null

    const consumo_kg_m2 = CONSUMO_TABLE[inputs.tipo_revestimiento]?.[inputs.tamano]?.[inputs.ancho_junta]
    if (consumo_kg_m2 == null) return null

    const producto = getProducto(inputs.tipo_revestimiento, inputs.ubicacion, inputs.losa_radiante)
    const consumo_total_kg = inputs.area_m2 * consumo_kg_m2

    const bolsas = producto.presentaciones.map(p => ({
      presentacion: p.label,
      cantidad: Math.ceil(consumo_total_kg / p.kg),
    }))

    return {
      producto,
      consumo_kg_m2,
      consumo_total_kg,
      bolsas,
    }
  })

  function reset() {
    Object.assign(inputs, {
      tipo_revestimiento: null,
      tamano: null,
      ubicacion: null,
      losa_radiante: null,
      ancho_junta: null,
      area_m2: null,
    })
  }

  return {
    inputs,
    result,
    isValid,
    reset,
    tamanosDisponibles,
    mostrarSelectorTamano,
  }
}
