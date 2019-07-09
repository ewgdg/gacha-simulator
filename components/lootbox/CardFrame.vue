<template>
  <div class="card-frame my-1">
    <transition enter-active-class="flip-card-animation" appear>
      <div class="flip-card">
        <div class="rounded-top text-bg pb-1">
          <rarity-label :rarity="rarity" class="hidden-back"></rarity-label>
        </div>
        <!--      <div class="flip-card">-->
        <!--      <transition enter-active-class="flip-card-inner-animation" appear>-->
        <div class="flip-card-inner">
          <div class="flip-card-front" :class="effect">
            <AgentPortrait :name="name"></AgentPortrait>
          </div>
          <div class="flip-card-back">
            <img
              src="~/assets/images/agents/card_back.png"
              alt="card back"
              class="img-fluid rounded-top"
              width="100%"
            />
          </div>
        </div>
        <!--            </transition>-->
        <!--      </div>-->
        <div>
          <h5
            class="text-center text-break text-capitalize text-justify text-bg rounded-bottom m-0"
          >
            <span class="hidden-back">
              {{ name }}
            </span>
          </h5>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import RarityLabel from '~/components/lootbox/RarityLabel.vue'
import AgentPortrait from '~/components/lootbox/AgentPortrait.vue'
export default {
  name: 'CardFrame',
  components: {
    RarityLabel: RarityLabel,
    AgentPortrait: AgentPortrait
  },
  props: {
    name: {
      type: String,
      required: true
    },
    rarity: {
      type: Number,
      default: 6
    }
  },
  computed: {
    effect() {
      return {
        'ur-effect': this.rarity === 6,
        'ssr-effect': this.rarity === 5,
        'sr-effect': this.rarity === 4
      }
    }
  }
}
</script>

<style scoped>
@media (max-width: 1000px) {
  h5 {
    font-size: 1rem;
  }
}

.text-bg {
  background-color: rgba(82, 79, 79, 0.1);
  background-image: linear-gradient(
    to right,
    rgba(82, 79, 79, 0.1),
    rgba(82, 79, 79, 0.4),
    rgba(82, 79, 79, 0.54),
    rgba(82, 79, 79, 0.4),
    rgba(82, 79, 79, 0.1)
  );
}
.hidden-back {
  backface-visibility: hidden;
  display: inline-block;
}
.sr-effect {
  box-shadow: 0px 0px 65px 0px rgba(115, 135, 235, 1);
}
.ssr-effect {
  box-shadow: 0px 0px 65px 0px rgba(242, 224, 31, 1);
}
.ur-effect {
  box-shadow: 0px 0px 65px 0px rgba(255, 108, 10, 1);
}
</style>
