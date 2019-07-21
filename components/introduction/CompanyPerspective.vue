<template>
  <div class="jumbotron page" style="height: 100%; overflow-y: scroll;">
    <div class="container footer-container">
      <h1 class="display-4">As a company</h1>
      <div class="paragraph">
        Skinnerian Gaming is a company that sells "loot box", player can open
        these loot boxes to get some unique collectible cards by chance. To
        capture more consumer surplus, Skinnerian Gaming decided to apply the

        <Definition toggle-id="price-discrimination-def">
          price discrimination
        </Definition>
        <b-collapse id="price-discrimination-def">
          <b-card>
            <Quote>
              <q>
                Price discrimination is a microeconomic pricing strategy where
                identical or largely similar goods or services are transacted at
                different prices by the same provider in different markets.
                Price discrimination is distinguished from product
                differentiation by the more substantial difference in production
                cost for the differently priced products involved in the latter
                strategy. Price differentiation essentially relies on the
                variation in the customers' willingness to pay and in the
                elasticity of their demand. Price discrimination, very
                differently, relies on monopoly power, including market share,
                product uniqueness, sole pricing power, etc. The term
                differential pricing is also used to describe the practice of
                charging different prices to different buyers for the same
                quality and quantity of a product, but it can also refer to a
                combination of price differentiation and product
                differentiation. Other terms used to refer to price
                discrimination include equity pricing, preferential pricing,
                dual pricing and tiered pricing. Within the broader domain of
                price differentiation, a commonly accepted classification dating
                to the 1920s is:
                <ul>
                  <li>
                    Personalized pricing (or first-degree price differentiation)
                    — selling to each customer at a different price; this is
                    also called one-to-one marketing. The optimal incarnation of
                    this is called perfect price discrimination and maximizes
                    the price that each customer is willing to pay.
                  </li>
                  <li>
                    Product versioning or simply versioning (or second-degree
                    price differentiation) — offering a product line by creating
                    slightly different products for the purpose of price
                    differentiation, i.e. a vertical product line. Another name
                    given to versioning is menu pricing.
                  </li>
                  <li>
                    Group pricing (or third-degree price differentiation) —
                    dividing the market into segments and charging a different
                    price to each segment (but the same price to each member of
                    that segment). This is essentially a heuristic approximation
                    that simplifies the problem in face of the difficulties with
                    personalized pricing. Typical examples include student
                    discounts and seniors' discounts.
                  </li>
                </ul>
              </q>
              <hr />
              <footer>
                <small>
                  Wikipedia contributors. (2019, July 1). Price discrimination.
                  In Wikipedia, The Free Encyclopedia. Retrieved 21:03, July 18,
                  2019, from
                  https://en.wikipedia.org/w/index.php?title=Price_discrimination&oldid=904313669
                </small>
              </footer>
            </Quote>
          </b-card>
        </b-collapse>

        strategy implicitly by adjusting individual rate of getting unique
        collectibles, while it try its best to maintains the general probability
        distribution unchanged via macroscopic control.
      </div>
      <p>
        To achieve this, the company will collect user statistics and calculate
        their willingness to pay. Players are then subdivided into 3 classes:
      </p>
      <ul>
        <li><Definition toggle-id="free-rider">Free rider</Definition></li>
        <b-collapse id="free-rider">
          <p>
            <small>
              Free riders used to be the most hatred players to the company, but
              the times have changed. They never pay but they are spiritual
              shareholder of the company. They are utilized to balance and
              leverage the general probability distribution when adjusting the
              individual rate. Company promotes them for propaganda and
              stimulating consumption.
            </small>
          </p>
        </b-collapse>
        <li><Definition toggle-id="chive">Chive</Definition></li>
        <b-collapse id="chive">
          <p>
            <small>
              Chive players fluctuate their willingness to pay by seasons, they
              are named chives because the company harvests them like farmer
              does on chives. They are most replaceable in these classes and can
              be quickly replenished. Sacrifice them when needed.
            </small>
          </p>
        </b-collapse>
        <li><Definition toggle-id="multiparous">M*********s</Definition></li>
        <b-collapse id="multiparous">
          <div class="p-0 m-0">
            <p class="m-0">
              <small>
                Warning! This is company's top secret.
              </small>
            </p>
          </div>
        </b-collapse>
      </ul>
      <div class="footer">
        <hr />
        <footer>page 2</footer>
      </div>
    </div>
  </div>
</template>

<script>
import Definition from '~/components/ui/Definition.vue'
import Quote from '~/components/ui/Quote'
export default {
  name: 'CompanyPerspective',
  components: { Definition, Quote }
}
</script>

<style scoped></style>
