<template>
  <div>
    <div class="jumbotron s-bg mb-0">
      <div class="s-bg-blur rounded mx-3 p-3">
        <h1 class="display-5" style="color: black">Background Story</h1>
        <p>
          <span class="lead">Long time ago,</span>
          <br />there is a company named 'Skinnerian Gaming' who invent the
          so-called
          <span v-b-toggle="'gacha-def'" class="clickable">
            <u>gacha</u><small><sup>[+]</sup></small>
          </span>
          mechanism.
        </p>

        <p>
          People are addictive to this type of game due their spirit of
          adventure and the operant conditioning.
        </p>
        <p>
          The company earns a lot of profit from it. However, it is not
          satisfied anymore...
        </p>
      </div>
    </div>
    <b-collapse id="gacha-def">
      <b-card>
        <Quote>
          <q>
            Gashapon (ガシャポン), also called gachapon (ガチャポン), are a
            variety of vending machine-dispensed capsule toys popular in Japan
            and elsewhere. "Gashapon" is onomatopoeic from the two sounds
            "gasha" (or "gacha") for the hand-cranking action of a toy-vending
            machine, and "pon" for the toy capsule landing in the collection
            tray. "Gashapon" is used for both the machines themselves and the
            toys obtained from them. Popular gashapon manufacturers include
            Tomy, which uses the shortened term gacha (ガチャ gacha) for their
            capsule machines, and Kaiyodo. In the United States, "Gashapon" is a
            registered trademark of the Bandai Company,[1] and gashapon are
            generally referred to as blind box sets. The gashapon model has been
            adapted digitally into numerous gacha video games such as mobile
            phone games and massively multiplayer online games (MMOs).
          </q>
          <hr />
          <footer>
            <small>
              Gachapon. In Wikipedia, The Free Encyclopedia. Retrieved 03:49,
              July 18, 2019, from
              https://en.wikipedia.org/w/index.php?title=Gachapon&oldid=33071165
            </small>
          </footer>
        </Quote>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
import Quote from '~/components/ui/Quote.vue'
export default {
  name: 'BackgroundStory',
  components: {
    Quote: Quote
  }
}
</script>

<style scoped>
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
