import { run, html, css } from './util/run'
import modifyClasses from '../src/vite'

test('Escape special characters', async () => {
  const config = {
    content: [
      {
        raw: html`
          <div class="first:mt-[20rpx]"></div>
          <div class="h-[80.5%]"></div>
          <div class="w-1/2"></div>
        `,
      },
    ],
    miniPrograms: true,
  }

  const input = css`
    @tailwind utilities;
  `
  const result = await run(input, config)
  return expect(result.css).toMatchFormattedCss(css`
    .h-_80_5__ {
      height: 80.5%;
    }
    .w-1_2 {
      width: 50%;
    }
    .first_mt-_20rpx_:first-child {
      margin-top: 20rpx;
    }
  `)
})

test('vite plugin', async () => {
  const source = html`
    <template>
      <div class="first:mt-[20rpx] hover:bg-gray-100"></div>
      <div class="h-[80.5%]"></div>
      <div class="w-1/2"></div>
    </template>
  `
  expect(modifyClasses().transform(source, 'App.vue')).toMatchInlineSnapshot(`
    "
        <template>
          <div class="first_mt-_20rpx_ hover_bg-gray-100"></div>
          <div class="h-_80_5__"></div>
          <div class="w-1_2"></div>
        </template>
      "
  `)
})
