import colors from 'vuetify/es5/util/colors'

let routerBase = '/'
// if (process.env.NODE_ENV === 'production') {
//   routerBase = '/rilievomisure'
// }

export default {
  mode: 'spa',
  router: {
    mode: 'hash',
    base: routerBase,
    middleware: ['acl']//['acl', 'auth']
  },
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [
      { src: 'js/browserfs.js' },
      { src: '_mono/config.js' },
      { src: '_mono/runtime.js' },
      { src: '_mono/mono.js', async: true }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: colors.blue.accent3 },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/main.css'
  ],
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },
  pwa: {
    workbox: {
      dev: false,
      workboxVersion: '0.0.2',
      importScripts: ['swextended.js'],
      // __workboxURL: "importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')",
      workboxURL: "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js",
      // runtimeCaching: [
      //   {
      //     urlPattern: 'https://fonts.googleapis.com/.*',
      //     handler: 'cacheFirst',
      //     method: 'GET',
      //     strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      //   }
      // ]
    },
    manifest: {
      display: 'standalone',
      name: 'Rilievo Misure',
      lang: 'it',
      start_utl: '/',
      permissions: {
        unlimitedStorage: true
      },
      unlimitedStorage: true
    }
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/startup',
    '@/plugins/filesystem',
    { src: '@/plugins/vuex-persist', ssr: false },
    // '@/plugins/swlisteners'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    //'@nuxtjs/auth',
    '@nuxtjs/pwa',
    '@nuxtjs/device',
    // 'nuxt-material-design-icons',
    'vue-scrollto/nuxt',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: {
      directives: ['Touch']
    },

    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.accent3,
          secondary: colors.blue.accent1,
          accent: colors.amber.base,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // config.optimization.splitChunks.maxSize = 100000;
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }

      // Web Worker support
        // config.module.rules.push({
        //   test: /\.worker\.js$/,
        //   use: { loader: 'worker-loader' },
        //   exclude: /(node_modules)/
        // })
    }
  }
}
