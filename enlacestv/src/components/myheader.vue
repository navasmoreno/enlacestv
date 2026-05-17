<template>
  <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div
      class="has-background-grey-lighter is-flex-direction-column is-flex-direction-row-widescreen navbar-brand is-flex-grow-1">
      <a id="navMenuBurger" role="button" class="is-align-self-flex-start m-0 mt-1 navbar-burger" data-target="navMenu"
        aria-label="menu" aria-expanded="false" @click="activeBurguer">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
      <div class="navbar-menu" id="navMenu">
        <div class="navbar-start">
          <!-- navbar items -->
          <router-link class="navbar-item is-hidden-touch" to="/">
            <img src="@/assets/logo.png">
          </router-link>
          <router-link class="navbar-item" :class="{ 'is-active': isactive == 'links' }" @click="selectItem"
            data-link='links' to="/links">Enlaces</router-link>
          <router-link class="navbar-item" :class="{ 'is-active': isactive == 'newlink' }" @click="selectItem"
            data-link='newlink' to="/newlink">Sugerir un enlance</router-link>
          <router-link class="navbar-item" :class="{ 'is-active': isactive == 'howtouse' }" @click="selectItem"
            data-link='howtouse' to="/howtouse">Como
            usarlos</router-link>
        </div>

        <div class="navbar-end">
        </div>
      </div>
    </div>

  </nav>

</template>
<script>
export default {
  name: 'MyHeader',
  mounted() {
    var el = document.getElementById('navMenuBurger');
    el.classList.remove("is-active");
    var linkselected = document.querySelector(`[href='${window.location.href.replace(window.location.origin, "")}']`)
    this.active(linkselected);
  },
  data() {
    return {
      isactive: ""
    }
  },
  methods: {
    activeBurguer() {
      var el = document.getElementById('navMenuBurger');
      const $target = document.getElementById(el.dataset.target);
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    },
    active(target) {
      this.isactive = target.dataset.link
    },
    selectItem(event) {
      this.active(event.target);
      this.activeBurguer();
    }
  }
}
</script>
<style>
.navbar-link:not(.is-arrowless):after {
  border-color: var(--bulma-navbar-item-color) !important;
}
</style>