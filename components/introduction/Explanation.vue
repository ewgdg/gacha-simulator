<template>
  <div>
    <h2>Guide Book</h2>

    <SlideContainer>
      <Slide :height="500" active>
        <SlideHeaderForCompany></SlideHeaderForCompany>
      </Slide>
      <Slide :height="500">
        <CompanyPerspective></CompanyPerspective>
      </Slide>
      <Slide :height="500">
        <CompanyPerspective2></CompanyPerspective2>
      </Slide>
    </SlideContainer>
    <hr />
    <SlideContainer id="player">
      <Slide :height="500" active>
        <SlideHeaderForPlayer></SlideHeaderForPlayer>
      </Slide>
      <Slide :height="500">
        <PlayerPerspective></PlayerPerspective>
      </Slide>
    </SlideContainer>
    <hr class="mb-5" />
  </div>
</template>

<script>
import SlideContainer from '~/components/ui/slides/SlideContainer'
import Slide from '~/components/ui/slides/Slide'
import CompanyPerspective from '~/components/introduction/CompanyPerspective'
import CompanyPerspective2 from '~/components/introduction/CompanyPerspective2'
import PlayerPerspective from '~/components/introduction/PlayerPerspective'
import SlideHeaderForCompany from '~/components/introduction/SlideHeaderForCompany'
import SlideHeaderForPlayer from '~/components/introduction/SlideHeaderForPlayer.vue'
export default {
  name: 'Explanation',
  components: {
    CompanyPerspective,
    CompanyPerspective2,
    SlideContainer,
    Slide,
    PlayerPerspective,
    SlideHeaderForCompany,
    SlideHeaderForPlayer
  }
}
</script>

<style scoped></style>
