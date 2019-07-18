<template>
  <div>
    <BackgroundStory></BackgroundStory>

    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Fluid jumbotron</h1>
        <p class="lead">
          This is a modified jumbotron that occupies the entire horizontal space
          of its parent.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// import NavBar from '~/components/NavBar.vue'
import BackgroundStory from '~/components/introduction/BackgroundStory.vue'

export default {
  name: 'HomePage',
  components: {
    BackgroundStory: BackgroundStory
  }
}
</script>

<style>
.s-bg-blur {
  position: relative;
  /*background-color: hsla(0, 0%, 100%, 0.3);*/
  background-color: white;
  overflow: hidden;
  z-index: 1;
  color: darkblue;
}

.s-bg-blur::before {
  content: '';
  filter: blur(5px);
  margin: -30px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: block;
  z-index: -1;
  opacity: 0.5;

  /*background-color: red;*/
  background-image: url('~assets/images/background/skinner_box.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

.s-bg {
  background: url('~assets/images/background/skinner_box.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>
