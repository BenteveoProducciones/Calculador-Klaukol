import { reactive, computed } from 'vue'
import { PRODUCTOS } from '~/constants/productos'

function esPiezaGrande(largo, ancho) {
  const sorted = [largo, ancho].sort((a, b) => a - b)
  return sorted[1] >= 120 && sorted[0] >= 60
}

function getPastaConsumption(key, maxDim) {
  if (key === 'PLA_K') {
    if (maxDim <= 15) return { kg: 2, llana: '4×4 mm' }
    if (maxDim <= 20) return { kg: 3, llana: '6×6 mm' }
    return { kg: 5, llana: '10×10 mm' }
  }
  if (maxDim <= 15) return { kg: 2, llana: '4×4 mm' }
  if (maxDim <= 20) return { kg: 3, llana: '6×6 mm' }
  if (maxDim <= 30) return { kg: 5, llana: '10×10 mm' }
  return { kg: 6, llana: '12×12 mm' }
}

function buildResult(producto, consumo_kg_m2, llana, doble_encolado, comentario, area) {
  const consumo_total_kg = area * consumo_kg_m2
  return {
    incompatible: false,
    producto,
    consumo_kg_m2,
    consumo_total_kg,
    bolsas: producto.presentaciones.map(p => ({
      presentacion: p.label,
      cantidad: Math.ceil(consumo_total_kg / p.kg),
    })),
    llana,
    doble_encolado,
    comentario,
  }
}

export function useAdhesivos() {
  const inputs = reactive({
    area_m2: null,
    largo_cm: null,
    ancho_cm: null,
    tipo_pieza: null,
    superficie_de_madera: false,
    placa_de_yeso: false,
    sobre_piso_existente: false,
    marmol: false,
    carpeta: false,
    losas_radiantes: null,
    exterior: null,
  })

  const isValid = computed(() =>
    (inputs.area_m2 ?? 0) > 0 &&
    (inputs.largo_cm ?? 0) > 0 &&
    (inputs.ancho_cm ?? 0) > 0 &&
    inputs.tipo_pieza !== null
  )

  const result = computed(() => {
    if (!isValid.value) return null

    const area = inputs.area_m2
    const largo = inputs.largo_cm
    const ancho = inputs.ancho_cm
    const maxDim = Math.max(largo, ancho)

    if (inputs.tipo_pieza === 'venecitas') {
      if (maxDim <= 15) return buildResult(PRODUCTOS.BLANCO_PRO, 3, '6×6 mm', false, 'Recomendado para piletas', area)
      if (maxDim <= 20) return buildResult(PRODUCTOS.BLANCO_PRO, 4, '8×8 mm', false, 'Recomendado para piletas', area)
      if (maxDim <= 30) return buildResult(PRODUCTOS.BLANCO_PRO, 5, '10×10 mm', false, 'Recomendado para piletas', area)
      return buildResult(PRODUCTOS.BLANCO_PRO, 6, '12×12 mm', false, 'Recomendado para piletas', area)
    }

    if (inputs.tipo_pieza === 'ladrillo_refractario') {
      return buildResult(PRODUCTOS.REFRACTARIO, 9, '6×6 mm', false, 'Recomendado para parrillas con ladrillo refractario', area)
    }

    if (inputs.placa_de_yeso) {
      const { kg, llana } = getPastaConsumption('PLA_K', maxDim)
      return buildResult(PRODUCTOS.PLA_K, kg, llana, false, null, area)
    }

    if (inputs.superficie_de_madera) {
      const { kg, llana } = getPastaConsumption('ECOSTIK', maxDim)
      return buildResult(PRODUCTOS.ECOSTIK, kg, llana, false, null, area)
    }

    if (inputs.losas_radiantes) {
      return buildResult(PRODUCTOS.FLEX, 6, '12×12 mm', true, null, area)
    }

    if (inputs.exterior || inputs.sobre_piso_existente) {
      const grande = esPiezaGrande(largo, ancho)
      const producto = grande ? PRODUCTOS.ULTRA_FLEX : PRODUCTOS.FLEX
      return buildResult(producto, 6, '12×12 mm', true, null, area)
    }

    switch (inputs.tipo_pieza) {
      case 'porcelanato': {
        const esMedio = maxDim >= 80
        const producto = esMedio
          ? PRODUCTOS.GRANDES_PIEZAS_PORCELLANATO
          : PRODUCTOS.PORCELLANATO_FLUIDO
        return buildResult(producto, 6, '12×12 mm', true, null, area)
      }

      case 'ceramico': {
        if (esPiezaGrande(largo, ancho)) {
          return buildResult(PRODUCTOS.GRANDES_PIEZAS_IMPERMEABLE, 6, '12×12 mm', true, null, area)
        }
        if (maxDim <= 40) {
          return buildResult(PRODUCTOS.IMPERMEABLE_POTENCIADO, 6, '12×12 mm', false, null, area)
        }
        return buildResult(PRODUCTOS.IMPERMEABLE_POTENCIADO, 6, '12×12 mm', true, null, area)
      }

      default:
        return null
    }
  })

  function reset() {
    Object.assign(inputs, {
      area_m2: null,
      largo_cm: null,
      ancho_cm: null,
      tipo_pieza: null,
      superficie_de_madera: false,
      placa_de_yeso: false,
      sobre_piso_existente: false,
      marmol: false,
      carpeta: false,
      losas_radiantes: false,
      exterior: false,
    })
  }

  return { inputs, result, isValid, reset }
}
