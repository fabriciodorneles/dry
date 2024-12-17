import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', '@rocketseat/eslint-config/next'),
  {
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      camelcase: 'off',
    },
  },
]

export default eslintConfig
