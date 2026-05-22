# Calculador Klaukol

Calculadora web de materiales Klaukol (Sika) para obra. Le dice al usuario qué producto usar y cuántas bolsas comprar a partir de los datos de su proyecto.

## Stack

- **Nuxt 4** (modo SPA por defecto, `app/` directory)
- **Vue 3** con `<script setup>` y Composition API
- **Tailwind CSS** vía `@nuxtjs/tailwindcss`
- **@nuxt/icon** con set `material-symbols`
- **@nuxt/fonts** y **@nuxt/image**
- Sin backend ni base de datos — toda la lógica es client-side

## Estructura

```
app/
├── pages/
│   └── index.vue              # Página única — hero + tabs + form/result
├── components/
│   ├── calculadores/
│   │   ├── TabSwitcher.vue    # Selector adhesivos / morteros / pastinas
│   │   ├── adhesivos/         # AdhesivosForm + AdhesivosResult
│   │   ├── morteros/          # MorterosForm + MorterosResult
│   │   └── pastinas/          # PastinasForm + PastinasResult
│   ├── form/                  # FormLabel, FormNumberInput (reusables)
│   └── shared/
│       └── Disclaimers.vue    # Texto legal al pie del resultado
├── composables/
│   ├── useAdhesivos.js        # Reglas + cálculo adhesivos
│   ├── useMorteros.js         # Tabla + cálculo morteros
│   └── usePastinas.js         # Tabla + cálculo pastinas
└── constants/
    └── productos.js           # Catálogo único de productos Klaukol
```

## Flujo

1. `pages/index.vue` mantiene `activeTab` y `currentResult` en estado local.
2. `TabSwitcher` cambia de calculadora; al cambiar de tab se resetea el resultado (watcher).
3. Cada `*Form.vue` usa su composable, emite `@calculated` con un objeto `result`.
4. Cuando hay `currentResult`, se renderiza `*Result.vue` + `Disclaimers`.
5. Botón "Recalcular" emite `@recalcular` → vuelve al form.

## Lógica por calculadora

### Adhesivos (`useAdhesivos.js`)
Selección por cascada de prioridades:
1. **Superficie de madera** → `Ecostik`
2. **Placa de yeso** → `Pla-K` (piezas ≤30cm) o `Ecostik` (piezas >30cm)
3. **Exterior / losa radiante / sobre piso existente** → `Flex` o `Ultra Flex Liviano` (si pieza grande)
4. Por tipo de pieza (porcelanato, cerámico, venecitas, ladrillo refractario)

Helper `getPastaConsumption()` mapea `maxDim` a `{ kg, llana }`.

### Morteros (`useMorteros.js`)
Tabla `MORTEROS_TABLE` por `tipo_ladrillo`. Devuelve `{ producto, min, max, avg, comentario }`. El campo `macizo` está `null` → caso incompatible que se muestra con UI especial.

Resultado en **rango** (min/max kg/m² y bolsas).

### Pastinas (`usePastinas.js`)
- `TIPOS_REVESTIMIENTO`: array con tamaños disponibles y `absorcion: 'alta' | 'baja'` inferida internamente (el usuario no la ve).
- `CONSUMO_TABLE[tipo][tamano][junta_mm]` → kg/m² único.
- Regla de producto: **Fluida PN** solo si `absorcion === 'alta'` + `ubicacion === 'interior'` + `!losa_radiante`. En todos los demás casos, **Alta Performance (AP)**.
- Si el tipo tiene un solo tamaño (azulejo 15×15, cerámica 20×20), el composable lo auto-selecciona y el form esconde el sub-selector.
- Resultado en **valor único** (no rango, a diferencia de morteros).

## Catálogo (`constants/productos.js`)

Estructura por producto:
```js
{
  nombre: 'Klaukol XXX',           // Nombre completo
  nombre_corto: 'Klaukol XX',      // Opcional, usado en Result si existe
  tipo: 'polvo' | 'pasta',
  unidad: 'balde' | undefined,     // Default: 'bolsas'
  presentaciones: [{ label: '25 kg', kg: 25 }, ...]
}
```

El cálculo de bolsas es `Math.ceil(consumo_total_kg / presentacion.kg)` por cada presentación.

## Convenciones de UI

- Color de marca: `bg-brand-red`, `text-brand-red`, `bg-brand-gray-mid`, `text-brand-gray-dark` (definidos en `tailwind.config.js`).
- Inputs/botones: borde gris por default, rojo cuando seleccionado/lleno.
- Labels: `<FormLabel>` siempre (consistencia tipográfica).
- Selectores tipo radio/checkbox: `<input class="sr-only">` + `<label>` estilado.
- Botón principal de cálculo: deshabilitado con `bg-brand-red/60 cursor-not-allowed` cuando `!isValid`.
- Breakpoints custom del proyecto: usar `xxl:` (1440px) cuando aplique. Orden mobile-first.
- **Orden de clases Tailwind**: seguir orden de `~/.claude/CLAUDE.md` (sizing → layout → position → backgrounds → borders → typography → effects → interactivity → overflow → svg → a11y → spacing).

## Imágenes (hero)

En `public/images/hero/`:
- `Adhesivos-S.png` (adhesivos)
- `morteros.webp` (morteros y pastinas — pastinas reusa la de morteros hasta tener imagen propia)

## Comandos

```bash
npm run dev      # Dev server (puerto 3000, fallback automático)
npm run build    # Build producción
npm run generate # Static site generation
npm run preview  # Preview del build
```

## Pendientes conocidos

- Imagen de hero específica para pastinas (hoy reusa la de morteros).
- Links del CTA "¿Ya sabés lo que necesitás?" están como `href="#"` — pendiente de URL real de e-commerce/distribuidores.
- No hay tests automáticos.
