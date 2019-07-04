<template>
  <div>
    <h1>this is title</h1>

    <div class="container">
      <b-navbar toggleable="md" type="light" variant="light" class="rounded">
        <b-navbar-brand href="/" @click.prevent>
          <nuxt-link tag="span" to="/">
            Home
          </nuxt-link>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" />

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="#">
              Link
            </b-nav-item>

            <b-nav-item href="/collection" @click.prevent>
              <nuxt-link tag="span" to="/collection">
                Collection
              </nuxt-link>
            </b-nav-item>

            <b-nav-item disabled href="#">
              Disabled
            </b-nav-item>
          </b-navbar-nav>

          <top-up-modal></top-up-modal>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form v-if="$route.path === '/collection'">
              <b-form-input
                v-model="searchValue"
                class="mr-sm-2"
                placeholder="Search by name"
                size="sm"
                @keypress.enter.prevent="
                  $eventBus.$emit('searchAgentName', searchValue)
                "
              />
              <b-button
                class="my-2 my-sm-0"
                size="sm"
                variant="outline-success"
                @click.prevent="$eventBus.$emit('searchAgentName', searchValue)"
              >
                Search
              </b-button>
            </b-nav-form>

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
import Tag from '~/components/funds/Tag.vue'
import TopUpModal from '~/components/funds/TopUpModal.vue'

export default {
  name: 'NavBar',
  components: {
    tag: Tag,
    TopUpModal: TopUpModal
  },
  data() {
    return { searchValue: '' }
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
