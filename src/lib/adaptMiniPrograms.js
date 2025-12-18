export const invalidChars = ':[]./%#'

export default function adaptMiniPrograms(context) {
  const config = context.tailwindConfig
  return (root) => {
    if (!config.miniPrograms) return

    // 转义小程序不支持的选择器字符
    // 例如：.first\:mt-[20px]:first-child -> .first_mt-_20px_:first-child
    const re = new RegExp(
      `\\\\[${Array.from(invalidChars)
        .map((char) => `\\${char}`)
        .join('')}]`,
      'g'
    )
    root.walkRules((rule) => {
      rule.selector = rule.selector.replace(re, '_')
    })
  }
}
