import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Camouflage",
  description: "API Mocking Made Easy",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      {
        text: 'Camouflage Documentation',
        items: [
          {
            text: 'Introduction',
            items: [
              { text: 'What is Camouflage?', link: '/' },
            ]
          },
          {
            text: 'HTTP',
            items: [
              { text: 'Quick Start', link: '/http/quick-start' },
              { text: 'Configuration', link: '/http/configuration' },
              { text: 'Available Methods', link: '/http/available-methods' },
              { text: 'Validation', link: '/http/validation' },
              { text: 'Compression', link: '/http/compression' },
            ]
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/camouflage-app' }
    ],
    search: {
      provider: 'local'
    }
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    },
  },
  ignoreDeadLinks: true,
  base: "/camouflage/"
})
