<template>
  <div>
    <div class="tag clickable" @click="$emit('click')">
      <img :src="icon" alt="icon" class="icon" />

      <div class="innerDiv">
        <span class="text-wrap text-justify text-center m-0 p-0">{{
          gemQuantity
        }}</span>
      </div>
    </div>
    <div class="bar rounded-bottom">
      <small>{{ price | currency }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriceTag',
  filters: {
    currency(value) {
      return '$' + value
    }
  },
  props: {
    price: {
      type: Number,
      required: true
    },
    gemQuantity: {
      type: Number,
      required: true
    }
  },
  computed: {
    price648Icon() {
      return require(process.env.price648iconUrl)
    },
    price168Icon() {
      return require(process.env.price168iconUrl)
    },
    icon() {
      if (this.price >= 328) {
        return this.price648Icon
      } else {
        return this.price168Icon
      }
    }
  }
}
</script>

<style scoped>
.tag {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
}

.innerDiv {
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  font-size: 1rem;
  background-color: rgba(225, 225, 232, 0.6);
}

.icon {
  width: 100%;
  height: auto;
}

.bar {
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  background-color: rgba(39, 39, 45, 0.4);
  color: white;
}
</style>
