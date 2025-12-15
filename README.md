# tailwindcss-mp

支持小程序的 Tailwindcss

## 使用

tailwindcss-mp 与 tailwindcss 的使用方式基本一致，只是在配上稍有不同。

talwind.config.js

```js
module.exports = {
  miniPrograms: true, // 开启小程序支持
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 小程序不需要 preflight
  },
}
```

为了兼容小程序，需要将原有的 tailwindcss postcss 插件改为新的插件。

### with Vite

vite.config.js

```diff
  import { defineConfig } from "vite";
- import tailwindcss from "tailwindcss";
+ import tailwindcss from "tailwindcss/lib/vite";

  export default defineConfig({
+   plugins: [tailwindcss()],
    css: {
      postcss: {
-       plugins: [tailwindcss()],
      },
    },
  });
```
