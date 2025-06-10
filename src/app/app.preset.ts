import {definePreset} from '@primeng/themes'
import Aura from '@primeng/themes/aura'

export const darkModeSelector = 'dark-mode'

export const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}'
    },
    colorScheme: {
      dark: {
        surface: {
          0: '{surface.0}',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}'
        }
      }
    },
    components: {
      menu: {
        colorScheme: {
          dark: {
            item: {
              color: '{slate.200}'
            }
          }
        }
      }
    }
  },
  extend: {
    status: {
      inactive: 'var(--p-zinc-50)'
    }
  },
  css: ({dt}: any) => `
    .inactive {
      background-color: ${dt('status.inactive')} !important;
    }
    `
})
