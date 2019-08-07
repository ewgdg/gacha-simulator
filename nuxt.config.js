// eslint-disable-next-line nuxt/no-cjs-in-config
const WorkerPlugin = require('worker-plugin')
// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Noto+Sans|Sedgwick+Ave&display=swap'
      }
    ],
    script: [
      { src: 'https://www.gstatic.com/firebasejs/6.3.3/firebase-app.js' }, // '/__/firebase/6.3.3/firebase-app.js' },
      { src: 'https://www.gstatic.com/firebasejs/6.3.3/firebase-auth.js' }, // '/__/firebase/init.js' }
      { src: 'https://www.gstatic.com/firebasejs/6.3.3/firebase-firestore.js' },
      { src: 'https://www.gstatic.com/firebasejs/6.3.3/firebase-functions.js' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false,
  /*
   ** Global CSS
   */
  css: ['~/assets/style/global.css', '~/assets/style/flip-card.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vuelidate',
    '~/plugins/eventBus',
    { src: '~/plugins/async', ssr: false },
    { src: '~/plugins/firebase', ssr: false },
    { src: '~/plugins/router_guard', ssr: false },
    { src: '~/plugins/vuex-persistedState', ssr: false },
    { src: '~/plugins/playerAgentManager', ssr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  buildDir: '.nuxt',
  build: {
    publicPath: '/_nuxt/',
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isClient) {
        // fix hotUpdatePlugin conflict when used with worker loader
        // config.output.globalObject = 'this'
        // using unshift if the code might need to be transpile with babel first
        // config.module.rules.push({
        //   test: /\.worker\.js$/,
        //   include: /workers/,
        //   use: [{ loader: 'worker-loader' }]
        // })
        // console.log(config.module.rules)
      }
    },
    plugins: [new WorkerPlugin({ globalObject: 'self' })]
  },
  env: {
    gemUnitQuantity: 50,
    cardCost: 600,
    gemstoneUrl: '~/assets/images/icons/gemstone.png',
    greenModifierUrl: '~/assets/images/icons/greenModifier.png',
    blueModifierUrl: '~/assets/images/icons/blueModifier.png',
    price648iconUrl: '~/assets/images/icons/648.png',
    price168iconUrl: '~/assets/images/icons/168.png',
    authPostfix: '@gacha.simulator'
  },
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  router: {
    middleware: ['auth']
  },
  dev: process.env.NODE_ENV !== 'production'
}
