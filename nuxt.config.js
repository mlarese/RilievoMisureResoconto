import colors from 'vuetify/es5/util/colors'

let routerBase = '/'
if (process.env.NODE_ENV === 'production') {
  routerBase = '/'
}

export default {
  mode: 'spa',
  router: {
    mode: 'hash',
    base: routerBase,
    middleware: ['acl']//['acl', 'auth']
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
      { src: '_mono/config.js' },
      { src: '_mono/runtime.js' },
      { src: '_mono/mono.js', async: true }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/startup'
  ],
  __auth: {
    redirect: {
      logout: '/login',
      callback: '/callback'
    },
    resetOnError: true,
    strategies: {
      dev: {
        _scheme: 'local',
        endpoints: {
          login: { baseURL: 'http://89.46.65.174:1001', url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: {baseURL: 'http://89.46.65.174:1001', url: '/auth/logout', method: 'post' },
          user: {baseURL: 'http://89.46.65.174:1001', url: '/auth/user', method: 'get', propertyName: 'user' }
        },
        tokenRequired: true,
        tokenType: 'bearer'
      },
      devip: {
        _scheme: 'local',
        endpoints: {
          login: { baseURL: 'http://89.46.65.174:1001', url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: {baseURL: 'http://89.46.65.174:1001', url: '/auth/logout', method: 'post' },
          user: {baseURL: 'http://89.46.65.174:1001', url: '/auth/user', method: 'get', propertyName: 'user' }
        },
        tokenRequired: true,
        tokenType: 'bearer'
      },
      prod: {
        _scheme: 'local',
        endpoints: {
          login: { baseURL: 'http://89.46.65.174:1001', url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: {baseURL: 'http://89.46.65.174:1001', url: '/auth/logout', method: 'post' },
          user: {baseURL: 'http://89.46.65.174:1001', url: '/auth/user', method: 'get', propertyName: 'user' }
        },
        tokenRequired: true,
        tokenType: 'bearer'
      },
      local: {
        endpoints: {
          login: { baseURL: 'http://89.46.65.174:1001', url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: {baseURL: 'http://89.46.65.174:1001', url: '/auth/logout', method: 'post' },
          user: {baseURL: 'http://89.46.65.174:1001', url: '/auth/user', method: 'get', propertyName: 'user' }
        },
        tokenRequired: true,
        tokenType: 'bearer'
      }
    }
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    //'@nuxtjs/auth',
    '@nuxtjs/pwa'
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
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
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
    extend(config, ctx) { }
  }
}
