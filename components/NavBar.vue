<template>
  <div>
    <h1 style="text-align: center">Gacha Simulator</h1>

    <!--    <DayHint></DayHint>-->
    <EndButton v-if="$route.path !== '/'"></EndButton>

    <div class="container">
      <b-navbar toggleable="md" type="light" variant="light" class="rounded">
        <nuxt-link tag="span" to="/">
          <b-navbar-brand href="/">
            Home
          </b-navbar-brand>
        </nuxt-link>

        <b-navbar-nav class="mr-auto align-items-center flex-row">
          <b-dropdown
            left
            text="Guide"
            :class="{ selected: isSelected('/guide') }"
            variant="light"
          >
            <b-dropdown-item-button @click="goto({ name: 'guide' })">
              Skinnerian Gaming
            </b-dropdown-item-button>

            <b-dropdown-item-button
              @click="goto({ name: 'guide', hash: '#player' })"
            >
              Player Guide
            </b-dropdown-item-button>
          </b-dropdown>

          <div
            :class="{ selected: isSelected('/play') }"
            style="padding: 6.5px"
          >
            <b-dropdown
              split
              split-href="/play"
              text="Play"
              size="sm"
              @click.prevent="$router.push('/play')"
            >
              <b-dropdown-item
                href="/play"
                @click.prevent="$router.push('/play')"
              >
                As Player
              </b-dropdown-item>
              <b-dropdown-item href="#" disabled @click.prevent>
                As Company
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </b-navbar-nav>

        <b-navbar-toggle target="nav-collapse" />

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="align-items-center">
            <nuxt-link v-if="gameStatus" tag="span" to="/statistics">
              <b-nav-item
                href="/statistics"
                :class="{ selected: isSelected('/statistics') }"
              >
                Statistics
              </b-nav-item>
            </nuxt-link>

            <top-up-modal>
              <li class=" nav-link" style="cursor: pointer" @click.prevent>
                Shop
              </li>
            </top-up-modal>

            <NextDayButton></NextDayButton>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto align-items-center">
            <b-dropdown
              right
              :class="{ selected: isSelected('/profile') }"
              variant="light"
            >
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>User </em>
              </template>

              <template v-if="!$store.state.user">
                <b-dropdown-item-button v-b-modal.modalsignin>
                  Login
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="goto('/signup')">
                  Register
                </b-dropdown-item-button>
              </template>
              <template v-else>
                <b-dropdown-item-button @click="goto('/profile')">
                  Profile
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="goto('/result')">
                  Ranking
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="signout">
                  Sign Out
                </b-dropdown-item-button>
              </template>
            </b-dropdown>

            <tag></tag>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <SignInForm> </SignInForm>
  </div>
</template>

<script>
import Tag from '~/components/funds/BalanceTag.vue'
import TopUpModal from '~/components/funds/TopUpModal.vue'
import NextDayButton from '~/components/ui/NextDayButton'
import EndButton from '~/components/ui/EndButton'
import SignInForm from '~/components/user/SignInForm'
// import DayHint from '~/components/ui/DayHint'

export default {
  name: 'NavBar',
  components: {
    tag: Tag,
    TopUpModal: TopUpModal,
    NextDayButton: NextDayButton,
    EndButton: EndButton,
    SignInForm: SignInForm
    // DayHint: DayHint
  },
  computed: {
    gameStatus() {
      return this.$store.state.gameStatus
    }
  },
  methods: {
    goto(link) {
      link = this.$router.resolve(link).route
      if (link.name === this.$route.name) {
        this.$router.replace('/redirecting', () => {
          this.$router.replace(link)
        })
      } else {
        this.$router.push(link)
      }
    },
    signout() {
      this.$eventBus.$emit('block')
      this.$auth.signOut().then(() => {
        this.$store.dispatch('clearSession')
        this.$router.replace('/')
        this.$eventBus.$emit('unblock')
      })
    },
    isSelected(path) {
      return this.$route.path === path
    }
  }
}
</script>

<style scoped>
.selected {
  border-color: rgba(121, 225, 219, 0.57) !important;
  border-style: solid !important;
  border-radius: 4px !important;
  box-sizing: border-box !important;
  border-width: 1px;
}
</style>
