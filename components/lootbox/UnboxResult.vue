<template>
  <div class="container">
    <!--    :key="$store.state.modules.lootboxResult.id"-->
    <transition name="fade" mode="out-in">
      <div
        v-if="display"
        :key="$store.state.modules.lootboxResult.id"
        class="row justify-content-around align-items-center scroll-container"
      >
        <card-frame
          v-for="(result, i) in getResults"
          :key="i"
          class="col-4 col-sm-3 col-md-2 col-md-2-x"
          :name="result"
          :rarity="getCardInfo(result).rarity"
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
  @media (max-width: 600px){
    .scroll-container{
      max-height: 40vh;
      overflow-y: auto;
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
    /*position: absolute;*/
    left: 0;
    top: 0;
    /*animation: fade-out 1s ease forwards, slide-out 1s ease forwards;*/
    animation: fade-out 0.37s ease;
  }
  .fade-enter-active{
    /*animation: fade-in 2s ease;*/
    animation: fade-in 0.33s ease;
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
      opacity: 0;
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
