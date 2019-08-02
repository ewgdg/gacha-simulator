<template>
  <div>
    <no-ssr>
      <b-tabs
        content-class="mt-3"
        justified
        :active-nav-item-class="['bg-info', 'text-light', 'text-active']"
      >
        <b-tab
          v-if="
            $store.state.modules.playerAgents.agents.player1 &&
              !$store.state.gameStatus
          "
          title="Local Rank"
        >
          <LocalRank></LocalRank>
        </b-tab>
        <b-tab title="Global Rank">
          <GlobalRank></GlobalRank>
        </b-tab>
      </b-tabs>
      <p slot="placeholder">Loading</p>
      <!--      <button @click="uploadScore">upload</button>-->
      <!--      <button @click="getRank">getRank</button>-->
    </no-ssr>
  </div>
</template>

<script>
import LocalRank from '~/components/ranking/LocalRank'
import GlobalRank from '~/components/ranking/GlobalRank'
export default {
  name: 'Index',
  components: {
    LocalRank: LocalRank,
    GlobalRank: GlobalRank
  },
  methods: {
    uploadScore() {
      this.$functions.useFunctionsEmulator('http://localhost:5001')
      return this.$uploadScore({
        username: 'tester',
        uid: this.$store.state.user.uid,
        score: 1233,
        localRank: 12
      })
    }
  }
}
</script>

<style scoped></style>
