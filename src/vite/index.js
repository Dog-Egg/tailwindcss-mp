import { invalidChars } from '../lib/adaptMiniPrograms'
import tailwindcss from '../index'

/**
 * 从 JavaScript 表达式中提取所有字符串字面量并替换
 * 支持数组、对象、三元运算符等复杂语法
 */
function replaceStringLiterals(expression, escapeFn) {
  const replacements = []
  let i = 0
  let inString = false
  let stringChar = null
  let stringStart = 0
  let escaped = false

  // 第一步：找到所有字符串字面量的位置
  while (i < expression.length) {
    const char = expression[i]

    if (!inString) {
      // 检查是否是字符串开始（单引号或双引号）
      if ((char === '"' || char === "'") && !escaped) {
        inString = true
        stringChar = char
        stringStart = i
        escaped = false
      } else {
        escaped = char === '\\' && !escaped
      }
    } else {
      // 在字符串内部
      if (char === '\\' && !escaped) {
        escaped = true
      } else if (char === stringChar && !escaped) {
        // 字符串结束，记录需要替换的内容
        const stringContent = expression.slice(stringStart + 1, i)
        const escapedContent = escapeFn(stringContent)
        replacements.push({
          start: stringStart + 1,
          end: i,
          replacement: escapedContent,
        })
        inString = false
        stringChar = null
        escaped = false
      } else {
        escaped = false
      }
    }

    i++
  }

  // 第二步：从后向前替换，避免位置偏移
  let result = expression
  for (let j = replacements.length - 1; j >= 0; j--) {
    const { start, end, replacement } = replacements[j]
    result = result.slice(0, start) + replacement + result.slice(end)
  }

  return result
}

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

      // 构建转义正则，转义字符类中需要转义的特殊字符
      // 在字符类中，需要转义的字符有: ] \ - ^
      const escapedChars = Array.from(invalidChars)
        .map((char) => {
          // 在字符类中，] 和 \ 需要转义
          if (char === ']' || char === '\\') {
            return `\\${char}`
          }
          return char
        })
        .join('')
      const re = new RegExp(`[${escapedChars}]`, 'g')

      // 转义类名中的特殊字符
      const escapeClassName = (className) => className.replace(re, '_')

      // 转义类名字符串中的类名
      const escapeClassString = (classString) => {
        return classString
          .split(/\s+/)
          .map((cls) => escapeClassName(cls))
          .join(' ')
      }

      let transformed = code

      // 替换 class="..." (但不匹配 :class)
      transformed = transformed.replace(
        /(^|[^:])(\s*)class\s*=\s*"([^"]+)"/g,
        (_match, before, space, classValue) => {
          return `${before}${space}class="${escapeClassString(classValue)}"`
        }
      )

      // 使用 AST 解析 :class 绑定中的 JavaScript 表达式
      transformed = transformed.replace(/:class\s*=\s*"([^"]+)"/g, (_match, expression) => {
        const escapedExpression = replaceStringLiterals(expression, escapeClassString)
        return `:class="${escapedExpression}"`
      })

      return transformed
    },
  }
}
