<template>
  <div>
    <!--    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>-->

    <div class="container pt-3 px-5" style="overflow-y: auto;">
      <!--      <transition-->
      <!--        tag="div"-->
      <!--        leave-active-class="fade-leave-active"-->
      <!--        enter-active-class="fade-enter-active"-->
      <!--        style="position: relative"-->
      <!--      >-->
      <div
        v-if="$store.state.modules.lootboxResult.list.length > 0"
        class="row justify-content-center"
        style="position: relative"
      >
        <card-frame
          v-for="result in getResults"
          :key="result.key"
          class="col-4 col-sm-3 col-md-2 col-md-2-x"
          :name="result.name"
          :rarity="getCardInfo(result.name).rarity"
        ></card-frame>
      </div>
      <!--      </transition>-->
    </div>
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
    })

  },
  methods: {

    list_item_highlight_class(name) {
      const rarity = this.getCardInfo(name).rarity
      return {
        'list-group-item-danger': rarity === 6,
        'list-group-item-warning': rarity === 5,
        'list-group-item-primary': rarity === 4,
        'list-group-item-success': rarity === 3,
        'list-group-item-info': rarity === 2
      }
    },
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

  @media (min-width: 900px){
    .container {
      width: 50%;
    }
  }
  .fade-enter{
    opacity: 0;
  }
  .fade-leave-to{
    opacity: 0;

  }
  .fade-enter-to,.fade-leave{
    opacity: 1;
  }
  .fade-leave-active{
    /*transition: opacity 3s ease;*/
    animation: fade-out 1s ease both, slide-out 1s ease both;
  }
  .fade-enter-active{
    /*animation: fade-in 2s ease;*/
    animation: slide-in 1s ease;
  }
  .fade-move{
    transition: all 1s linear;

  }
  .v-move{
    transition: all 2s linear;
  }
  @keyframes fade-out {
    from{
      opacity: 1;
    }
    to{
      opacity: 0;
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
    }
    to{
      transform: translateY(-100%);
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
