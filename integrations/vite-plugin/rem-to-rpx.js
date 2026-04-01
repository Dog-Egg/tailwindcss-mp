function formatNumber(value) {
  if (Number.isInteger(value)) {
    return String(value)
  }

  return value.toFixed(6).replace(/\.?0+$/, '')
}

function remToRpx(rootValue = 32) {
  return {
    postcssPlugin: 'rem-to-rpx',
    Declaration(decl) {
      decl.value = decl.value.replace(/(-?\d*\.?\d+)rem\b/g, (_, rawValue) => {
        return `${formatNumber(Number(rawValue) * rootValue)}rpx`
      })
    },
  }
}

remToRpx.postcss = true

module.exports = remToRpx
