<template>
  <div class="is-flex is-flex-direction-column" style="height: inherit;">
    <myheader class="is-flex-grow-0"></myheader>
    <div class="content is-flex-grow-1 mt-6 mb-0 pb-2 pt-4" style="overflow: auto;">
        <router-view style="height: 100%;"></router-view>
    </div>
    <myfooter></myfooter>
  </div>
</template>