declare type VitePlugin = {
  name: string
  enforce?: 'pre' | 'post'
  config?: () => Record<string, unknown>
  transform?: (code: string, id: string) => string | void
}

declare function tailwindcss(): VitePlugin

export = tailwindcss
