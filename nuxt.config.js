export default {
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
          'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css'
      },
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
  loading: { color: '#fff' },
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
    '~/plugins/async',
    { src: '~/plugins/vuex-persist', ssr: false },
    { src: '~/plugins/firebase', ssr: false }
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
  build: {
    // publicPath: '/',
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
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
    host: 'localhost' // default: localhost
  },
  dev: process.env.NODE_ENV !== 'production'
}
