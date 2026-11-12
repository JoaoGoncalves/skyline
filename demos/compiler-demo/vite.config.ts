import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// npm run dev              → COM React Compiler
// npm run dev:sem-compiler → SEM React Compiler (COMPILER=off)
const withCompiler = process.env.COMPILER !== 'off'

console.log(`\n  React Compiler: ${withCompiler ? 'LIGADO ✨' : 'desligado'}\n`)

export default defineConfig({
  plugins: [
    react(),
    ...(withCompiler ? [babel({ presets: [reactCompilerPreset()] })] : []),
  ],
})
