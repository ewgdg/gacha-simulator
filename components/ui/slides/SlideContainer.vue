<template>
  <div class="slideshow-container" :style="{ height: height + 'px' }">
    <!--    <transition>-->
    <!--      <div v-show="test">test</div>-->
    <!--      <div v-show="!test">test2</div>-->
    <!--    </transition>-->
    <slot></slot>
    <!-- Next and previous buttons -->
    <a class="prev" :class="{ disabled: disabled }" @click="plusSlides(-1)"
      >&#10094;</a
    >
    <a class="next" :class="{ disabled: disabled }" @click="plusSlides(1)"
      >&#10095;</a
    >

    <!-- The dots/circles -->
    <div class="dot-container">
      <span
        v-for="(slide, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === activeIndex }"
        @click="plusSlides(i - activeIndex)"
      >
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideContainer',
  data() {
    return {
      slides: [],
      activeIndex: 0,
      height: 0,
      disabled: false
    }
  },
  mounted() {
    let i = 0
    // console.log(this.$children)
    for (const slide of this.$children) {
      if (slide._name !== '<Slide>') {
        continue
      }
      this.slides.push(slide)
      this.height = Math.max(this.height, slide.height)
      // console.log(slide)
      if (
        slide.$attrs.active !== undefined &&
        slide.$attrs.active !== 'false'
      ) {
        this.activeIndex = i
      }
      i++
    }
    if (this.slides.length > 0) {
      this.slides[this.activeIndex].display = true
    }
  },
  methods: {
    plusSlides(n) {
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 1001)
      if (this.slides.length > 0) {
        this.slides[this.activeIndex].reversed = n < 0
        this.slides[this.activeIndex].display = false
      }
      this.activeIndex += n
      this.activeIndex = this.activeIndex % this.slides.length
      if (this.activeIndex < 0) {
        this.activeIndex += this.slides.length
      }
      if (this.slides.length > 0) {
        this.slides[this.activeIndex].reversed = n < 0
        this.slides[this.activeIndex].display = true
      }
    }
  }
}
</script>

<style scoped>
/* Slideshow container */
.slideshow-container {
  /*max-width: 1000px;*/
  position: relative;
  display: table;
  width: 100%;
  overflow: hidden;
}

/* Next & previous buttons */
.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: auto;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 1s ease;
  user-select: none;
  background-color: rgba(225, 225, 232, 0.32);
  z-index: 2;
}
.prev {
  left: 0;
  border-radius: 0 3px 3px 0;
}
/* Position the "next button" to the right */
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}
.prev:hover,
.next:hover {
  background-color: rgba(225, 225, 232, 0.8);
  opacity: 1;
}

.dot {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: rgba(129, 21, 40, 1);
  border-radius: 50%;
  display: inline-block;
  transition: all 0.6s ease;
  opacity: 0.6;
}

.active,
.dot:hover {
  background-color: rgba(129, 21, 40, 1);
}
.active {
  opacity: 1;
}

.dot-container {
  text-align: center;
  position: absolute;
  bottom: 0;
  z-index: 1;
  width: 100%;
}
.disabled {
  pointer-events: none;
  cursor: default;
  /*background-color: #bbb;*/
  opacity: 0;
}
</style>
