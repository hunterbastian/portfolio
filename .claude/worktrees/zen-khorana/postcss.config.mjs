import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-import': {
      path: [resolve(__dirname, 'node_modules')],
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
