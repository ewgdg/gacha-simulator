<template>
  <div class="card-frame py-1">
    <transition enter-active-class="flip-card-animation" appear>
      <div class="flip-card">
        <div class="rounded-top text-bg flip-card-head">
          <rarity-label :rarity="rarity" class="hidden-back"></rarity-label>
        </div>
        <div class="flip-card-inner">
          <div class="flip-card-front" :class="effect">
            <AgentPortrait :name="name" style="width: 100%"></AgentPortrait>
          </div>
          <div class="flip-card-back">
            <img
              src="~/assets/images/agents/card_back.png"
              alt="card back"
              style="width: 100%;"
            />
          </div>
        </div>

        <div class="flip-card-tail">
          <h5
            class="text-center text-nowrap text-capitalize text-bg rounded-bottom m-0 p-0 flip-card-tail"
          >
            <div class="hidden-back p-0 m-0">
              {{ name }}
            </div>
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
h5 {
  font-size: 1rem;
  line-height: 1.2rem;
}
@media (max-width: 1000px) {
  h5 {
    font-size: 0.8rem;
  }
}
@media (max-width: 333px) {
  h5 {
    font-size: 0.7rem;
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

.sr-effect {
  box-shadow: 0px 0px 33px 0px rgba(115, 135, 235, 1);
}
.ssr-effect {
  box-shadow: 0px 0px 33px 0px rgba(242, 224, 31, 1);
}
.ur-effect {
  box-shadow: 0px 0px 33px 0px rgba(255, 108, 10, 1);
}
</style>
