import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'tsup',
  target: 'es5',
  legacyOutput: true,
  clean: true,
  noExternal: [
    'zod'
  ]
})