import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Camouflage",
  description: "API Mocking Made Easy",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/introduction/what-is-camouflage' }
    ],

    sidebar: [
      {
        text: 'Camouflage Documentation',
        items: [
          {
            text: 'Introduction',
            items: [
              { text: 'What is Camouflage?', link: '/introduction/what-is-camouflage' },
              { text: 'Quick Start', link: '/introduction/quick-start' },
            ]
          },
          {
            text: 'Framework Integration',
            items: [
              { text: 'Vite (Svelte, React, Vue, etc)', link: '/framework-integration/vite' },
              { text: 'Sveltekit', link: '/framework-integration/sveltekit' },
              // { text: 'Next.js', link: '/framework-integration/next-js' },
              // { text: 'Nuxt', link: '/framework-integration/nuxt' },
            ]
          },
          {
            text: 'Configuration',
            link: "/configuration",
            items: [
              { text: 'HTTP', link: '/configuration/http' },
              { text: 'gRPC', link: '/configuration/grpc' },
              { text: 'Advanced Configuration', link: '/configuration/advanced' },
            ]
          },
          {
            text: 'Writing Mocks',
            items: [
              { text: 'HTTP', link: '/writing-mocks/http' },
              { text: 'gRPC', link: '/writing-mocks/grpc' }
            ]
          },
          {
            text: 'Helpers',
            link: '/helpers'
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
  }
})
