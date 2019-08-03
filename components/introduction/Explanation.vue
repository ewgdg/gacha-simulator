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
      <Slide :height="500">
        <CompanyPerspective3></CompanyPerspective3>
      </Slide>
      <Slide :height="500">
        <CompanyPerspective4></CompanyPerspective4>
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
      <Slide :height="500">
        <PlayerPerspective2></PlayerPerspective2>
      </Slide>
      <Slide :height="500">
        <PlayerPerspective3></PlayerPerspective3>
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
import CompanyPerspective3 from '~/components/introduction/CompanyPerspective3'
import CompanyPerspective4 from '~/components/introduction/CompanyPerspective4'
import PlayerPerspective from '~/components/introduction/PlayerPerspective'
import PlayerPerspective2 from '~/components/introduction/PlayerPerspective2'
import PlayerPerspective3 from '~/components/introduction/PlayerPerspective3'
import SlideHeaderForCompany from '~/components/introduction/SlideHeaderForCompany'
import SlideHeaderForPlayer from '~/components/introduction/SlideHeaderForPlayer.vue'
export default {
  name: 'Explanation',
  components: {
    CompanyPerspective,
    CompanyPerspective2,
    CompanyPerspective3,
    CompanyPerspective4,
    SlideContainer,
    Slide,
    PlayerPerspective,
    PlayerPerspective2,
    PlayerPerspective3,
    SlideHeaderForCompany,
    SlideHeaderForPlayer
  }
}
</script>

<style scoped></style>
