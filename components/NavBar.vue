<template>
  <div>
    <h1 style="text-align: center">Gacha Simulator</h1>

    <!--    <DayHint></DayHint>-->
    <EndButton></EndButton>

    <div class="container">
      <b-navbar toggleable="md" type="light" variant="light" class="rounded">
        <nuxt-link tag="span" to="/">
          <b-navbar-brand href="/" @click.prevent>
            Home
          </b-navbar-brand>
        </nuxt-link>

        <b-navbar-nav class="mr-auto">
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
            <nuxt-link v-if="gameStatus" tag="span" to="/collection">
              <b-nav-item href="/collection" @click.prevent>
                Collection
              </b-nav-item>
            </nuxt-link>

            <nuxt-link v-if="gameStatus" tag="span" to="/statistics">
              <b-nav-item href="/statistics" @click.prevent>
                Statistics
              </b-nav-item>
            </nuxt-link>

            <top-up-modal>
              <b-nav-item href="/" @click.prevent>Shop </b-nav-item>
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
              <b-dropdown-item href="#">
                Profile
              </b-dropdown-item>
              <b-dropdown-item href="#">
                Sign Out
              </b-dropdown-item>
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
// import DayHint from '~/components/ui/DayHint'

export default {
  name: 'NavBar',
  components: {
    tag: Tag,
    TopUpModal: TopUpModal,
    NextDayButton: NextDayButton,
    EndButton: EndButton
    // DayHint: DayHint
  },
  computed: {
    gameStatus() {
      return this.$store.state.gameStatus
    }
  },
  methods: {
    clearLootboxData() {
      this.$store.commit('modules/lootboxResult/reset')
      return false
    }
  }
}
</script>

<style scoped></style>
