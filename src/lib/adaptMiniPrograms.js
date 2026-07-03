export const invalidChars = ':[]./%#!(),'

export default function adaptMiniPrograms(context) {
  const config = context.tailwindConfig
  return (root) => {
    if (!config.miniPrograms) return

    // 转义小程序不支持的选择器字符
    // 例如：.first\:mt-[20px]:first-child -> .first_mt-_20px_:first-child
    const escapedCharRe = new RegExp(
      `\\\\[${Array.from(invalidChars)
        .map((char) => `\\${char}`)
        .join('')}]`,
      'g'
    )
    // CSS 选择器可能会把转义字符序列化为十六进制转义，例如把 `,` 写成 `\2c `。
    const hexEscapedCharRe = new RegExp(
      `\\\\(?:${Array.from(invalidChars)
        .map((char) => char.charCodeAt(0).toString(16))
        .join('|')})(?:\\s|(?=[^a-f0-9]|$))`,
      'gi'
    )
    root.walkRules((rule) => {
      rule.selector = rule.selector.replace(escapedCharRe, '_').replace(hexEscapedCharRe, '_')
    })
  }
}
