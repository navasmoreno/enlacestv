<template>
  <div class="is-flex is-flex-direction-column" style="height: inherit;">
    <myheader class=""></myheader>
    <div class="mt-6 py-2 content is-flex-grow-1">
      <router-view></router-view>
    </div>
    <myfooter></myfooter>
  </div>
</template>