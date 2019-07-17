<template>
  <!--    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>-->
  <!--    style="overflow-y: auto;"-->

  <div class="container" style="position: relative;">
    <transition
      leave-active-class="fade-leave-active"
      enter-active-class="fade-enter-active"
      mode="out-in"
    >
      <div
        v-if="display"
        :key="
          $store.state.modules.playerAgents.agents.player1.dailyDrawFrequency +
            ':' +
            $store.state.modules.statistics.day
        "
        class="row justify-content-center"
        style="position: absolute;top: 0; left: 0; right: 0; bottom: 0;"
      >
        <card-frame
          v-for="result in getResults"
          :key="result.key"
          class="col-4 col-sm-3 col-md-2 col-md-2-x"
          :name="result.name"
          :rarity="getCardInfo(result.name).rarity"
        ></card-frame>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import CardFrame from './CardFrame.vue'

export default {
  name: 'UnboxResult',
  data(){
    return {items: [1,2,3,4,5,6,7,8,9]}
  },
  computed: {
    ...mapGetters({
      getCardInfo: 'modules/cards/getCardInfo',
      getResults: 'modules/lootboxResult/getResults'
    }),
    display(){
      return this.$store.state.modules.lootboxResult.list.length > 0
    }

  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  },
  components: {
    CardFrame: CardFrame
  }
}
</script>

<style scoped>


  @media (max-width: 575px){
    .container {
      width: 70%;
    }
  }
  @media (min-width: 600px){
    .container {
      width: 80%;
    }
  }
  @media (min-width: 992px){
    .container {
      width: 60%;
    }
  }
  /*.fade-enter{*/
  /*  opacity: 0;*/
  /*}*/
  /*.fade-leave-to{*/
  /*  opacity: 0;*/

  /*}*/
  /*.fade-enter-to,.fade-leave{*/
  /*  opacity: 1;*/
  /*}*/
  .fade-leave-active{
    /*transition: opacity 3s ease;*/
    position: absolute;
    left: 0;
    top: 0;
    /*animation: fade-out 1s ease forwards, slide-out 1s ease forwards;*/
    animation: fade-out 0.37s ease both;
  }
  .fade-enter-active{
    /*animation: fade-in 2s ease;*/
    animation: fade-in 0.33s ease both;
  }
  /*.fade-move{*/
  /*  transition: all 1s linear;*/
  /*}*/

  @keyframes fade-out {
    from{
      opacity: 1;
      /*position: absolute;*/
    }
    to{
      opacity: 0;
      /*position: absolute;*/
    }
  }
  @keyframes fade-in {
    from{
      opacity: 0.33;
    }
    to{
      opacity: 1;
    }
  }
  @keyframes slide-out {
    from{
      transform: translateY(0);
      /*position: absolute;*/
    }
    to{
      transform: translateY(-100%);
      /*position: absolute;*/
    }
  }
  @keyframes slide-in {
    from{
      transform: translateY(100%);
    }
    to{
      transform: translateY(0%);
    }
  }
</style>
