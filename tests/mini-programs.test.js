import { run, html, css } from './util/run'
import modifyClasses from '../src/vite'

test('Remove Selector *', async () => {
  const config = {
    miniPrograms: true,
    corePlugins: {
      preflight: false,
    },
  }

  const input = css`
    @tailwind base;
  `
  const result = await run(input, config)
  return expect(result.css).toMatchFormattedCss(css`
    :before,
    :after,
    ::backdrop {
      --tw-border-spacing-x: 0;
      --tw-border-spacing-y: 0;
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-rotate: 0;
      --tw-skew-x: 0;
      --tw-skew-y: 0;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-pan-x: ;
      --tw-pan-y: ;
      --tw-pinch-zoom: ;
      --tw-scroll-snap-strictness: proximity;
      --tw-gradient-from-position: ;
      --tw-gradient-via-position: ;
      --tw-gradient-to-position: ;
      --tw-ordinal: ;
      --tw-slashed-zero: ;
      --tw-numeric-figure: ;
      --tw-numeric-spacing: ;
      --tw-numeric-fraction: ;
      --tw-ring-inset: ;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-color: #3b82f680;
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-ring-shadow: 0 0 #0000;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-colored: 0 0 #0000;
      --tw-blur: ;
      --tw-brightness: ;
      --tw-contrast: ;
      --tw-grayscale: ;
      --tw-hue-rotate: ;
      --tw-invert: ;
      --tw-saturate: ;
      --tw-sepia: ;
      --tw-drop-shadow: ;
      --tw-backdrop-blur: ;
      --tw-backdrop-brightness: ;
      --tw-backdrop-contrast: ;
      --tw-backdrop-grayscale: ;
      --tw-backdrop-hue-rotate: ;
      --tw-backdrop-invert: ;
      --tw-backdrop-opacity: ;
      --tw-backdrop-saturate: ;
      --tw-backdrop-sepia: ;
      --tw-contain-size: ;
      --tw-contain-layout: ;
      --tw-contain-paint: ;
      --tw-contain-style: ;
    }
  `)
})

test('Escape special characters', async () => {
  const config = {
    content: [
      {
        raw: html`
          <div class="first:mt-[20rpx]"></div>
          <div class="h-[80.5%]"></div>
          <div class="w-1/2"></div>
          <div class="space-x-3"></div>
          <div class="space-y-3"></div>
          <div class="border-b"></div>
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
    .space-x-3 > view + view {
      --tw-space-x-reverse: 0;
      margin-right: calc(0.75rem * var(--tw-space-x-reverse));
      margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
    }
    .space-y-3 > view + view {
      --tw-space-y-reverse: 0;
      margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
      margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
    }
    .border-b {
      border-bottom-width: 1px;
      border-bottom-style: solid;
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
