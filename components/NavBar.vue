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

        <b-navbar-nav class="mr-auto">
          <b-nav-item-dropdown left text="Guide">
            <b-dropdown-item-button @click="goto({ name: 'guide' })">
              Skinnerian Gaming
            </b-dropdown-item-button>

            <b-dropdown-item-button
              @click="goto({ name: 'guide', hash: '#player' })"
            >
              Player Guide
            </b-dropdown-item-button>
          </b-nav-item-dropdown>

          <nuxt-link tag="span" to="/play">
            <b-nav-item href="/play" @click.prevent>
              Play
            </b-nav-item>
          </nuxt-link>
        </b-navbar-nav>

        <b-navbar-toggle target="nav-collapse" />

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <!--            nuxt-link in outer space so that we can click the whole rect area -->
            <!--            <nuxt-link v-if="gameStatus" tag="span" to="/collection">-->
            <!--              <b-nav-item href="/collection" @click.prevent>-->
            <!--                Collection-->
            <!--              </b-nav-item>-->
            <!--            </nuxt-link>-->

            <nuxt-link v-if="gameStatus" tag="span" to="/statistics">
              <b-nav-item href="/statistics" @click.prevent>
                Statistics
              </b-nav-item>
            </nuxt-link>

            <top-up-modal>
              <li class="nav-item nav-link" style="cursor: pointer">
                Shop
              </li>
            </top-up-modal>

            <b-nav-item v-if="gameStatus" href="/" @click.prevent>
              <NextDayButton></NextDayButton>
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <!--            search button-->
            <!--            <b-nav-form v-if="$route.path === '/collection' ">-->
            <!--              <b-form-input-->
            <!--                v-model="searchValue"-->
            <!--                class="mr-sm-2"-->
            <!--                placeholder="Search by name"-->
            <!--                size="sm"-->
            <!--                @keypress.enter.prevent="-->
            <!--                  $eventBus.$emit('searchAgentName', searchValue)-->
            <!--                "-->
            <!--              />-->
            <!--              <b-button-->
            <!--                class="my-2 my-sm-0"-->
            <!--                size="sm"-->
            <!--                variant="outline-success"-->
            <!--                @click.prevent="$eventBus.$emit('searchAgentName', searchValue)"-->
            <!--              >-->
            <!--                Search-->
            <!--              </b-button>-->
            <!--            </b-nav-form>-->

            <b-nav-item-dropdown right text="Lang">
              <b-dropdown-item href="#">
                EN
              </b-dropdown-item>
              <b-dropdown-item href="#">
                ES
              </b-dropdown-item>
              <b-dropdown-item href="#">
                RU
              </b-dropdown-item>
              <b-dropdown-item href="#">
                FA
              </b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template slot="button-content">
                <em>User </em>
              </template>

              <SignInForm v-if="$store.state.user">
                <b-dropdown-item-button>Sign In</b-dropdown-item-button>
              </SignInForm>
              <b-dropdown-item href="#">
                Profile
              </b-dropdown-item>
              <b-dropdown-item-button @click="signout">
                Sign Out
              </b-dropdown-item-button>
            </b-nav-item-dropdown>

            <tag></tag>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
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
      this.$auth.signOut().then(() => {
        this.$store.dispatch('clearSession')
      })
    }
  }
}
</script>

<style scoped></style>
