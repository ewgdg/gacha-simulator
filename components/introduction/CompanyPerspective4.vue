<template>
  <div class="jumbotron page" style="height: 100%; overflow-y: auto;">
    <div class="container footer-container">
      <div class="paragraph">
        <p>
          The server will perform periodical(once per week) check on the stat
          and is able to detect abnormal stat.
        </p>
        <p>
          If the stat does not match with the announced odds(especially for
          rarity 6), the company will perform a server maintenance and issue a
          hotfix.
        </p>
        <p>
          As a result, player will get compensated for the server maintenance.
        </p>
        <p>
          The compensation is proportional to the maintenance time which depends
          on the difference between expected odd and the actual stat population
          mean.
        </p>
        <p>The company needs a strategy to avoid this situation.</p>
      </div>
      <div class="footer">
        <hr />
        <footer>page 5</footer>
      </div>
    </div>
  </div>
</template>

<script>
// import Quote from '~/components/ui/Quote'
export default {
  name: 'CompanyPerspective4'
  // components: {
  //   Quote: Quote
  // }
}
</script>

<style scoped></style>
