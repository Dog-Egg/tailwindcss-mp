try {
  require('isomorphic-fetch')
} catch {}

let $ = require('../../execute')
let { css } = require('../../syntax')

let { readOutputFile } = require('../../io')({
  output: 'dist',
  input: '.',
})

describe('static build', () => {
  test('the Vite plugin transforms classes and preserves user PostCSS plugins', async () => {
    await $('vite build', {
      env: { NODE_ENV: 'production', NO_COLOR: '1' },
    })

    expect(await readOutputFile('index.html')).toContain(
      'class="w-1_2 h-_80_5__ bg-__6b2c3e_ p-4 rounded"'
    )

    expect(await readOutputFile(/index.[a-z0-9_-]+\.css$/i)).toIncludeCss(
      css`
        .h-_80_5__ {
          height: 80.5%;
        }
        .w-1_2 {
          width: 50%;
        }
        .rounded {
          border-radius: 8rpx;
        }
        .bg-__6b2c3e_ {
          --tw-bg-opacity: 1;
          background-color: rgb(107 44 62 / var(--tw-bg-opacity, 1));
        }
        .p-4 {
          padding: 32rpx;
        }
      `
    )
  })
})
