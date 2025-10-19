import { invalidChars } from '../lib/adaptMiniPrograms'
import tailwindcss from '../index'

export default function modifyClasses() {
  return {
    name: 'modify-classes',
    enforce: 'pre',
    config() {
      return {
        css: {
          postcss: {
            plugins: [tailwindcss()],
          },
        },
      }
    },
    transform(code, id) {
      // 仅处理 HTML / Vue / Svelte 文件
      if (!/\.(html|vue|svelte)$/.test(id)) {
        return
      }

      const re = new RegExp(
        `[${Array.from(invalidChars)
          .map((char) => `\\${char}`)
          .join('')}]`,
        'g'
      )
      // 替换所有 class="..."
      const transformed = code.replace(/class\s*=\s*"([^"]+)"/g, (_, classValue) => {
        const newClasses = classValue
          .split(/\s+/)
          .map((cls) => cls.replace(re, '_'))
          .join(' ')
        return `class="${newClasses}"`
      })
      return transformed
    },
  }
}
