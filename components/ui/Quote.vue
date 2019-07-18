<template>
  <div>
    <div class="panel-body quote">
      <slot></slot>
    </div>
  </div>
</template>

<script></script>

<style>
.panel-body {
  font-family: 'Arizonia', cursive;
  /*font-size: 24px;*/
  color: #6e6e6e;
}

.quote {
  cursor: text;
}

/*.quote:hover {*/
/*  background-color: #ffe2e2;*/
/*}*/
</style>
