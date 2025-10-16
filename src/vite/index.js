export default function modifyClasses() {
  return {
    name: 'modify-classes',
    enforce: 'pre',
    transform(code, id) {
      // 仅处理 HTML / Vue / Svelte 文件
      if (!/\.(html|vue|svelte)$/.test(id)) {
        return
      }

      // 替换所有 class="..."
      const transformed = code.replace(/class\s*=\s*"([^"]+)"/g, (_, classValue) => {
        const newClasses = classValue
          .split(/\s+/)
          .map((cls) => replaceInvalidChars(cls))
          .join(' ')
        return `class="${newClasses}"`
      })
      return transformed
    },
  }
}

// 自定义替换规则函数
function replaceInvalidChars(cls) {
  // 这里按需调整：微信小程序不支持 :, [, ]
  return cls.replace(/[:\[\]\%\.\/]/g, '_')
}
