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
            data-link='newlink' to="/newlink">Sugerir un
            enlance</router-link>
          <router-link class="navbar-item" :class="{ 'is-active': isactive == 'howtouse' }" @click="selectItem"
            data-link='howtouse' to="/howtouse">Como
            usarlos</router-link>
          <div class="navbar-item has-dropdown is-hoverable pb-0">
            <a class="navbar-link" :class="{ 'is-active': isactive && isactive.includes('manage') }">
              Configuración
            </a>
            <div class="navbar-dropdown pt-0" style="border: none">
              <router-link class="navbar-item" :class="{ 'is-active': isactive == 'manage/resolutions' }"
                @click="selectItem" data-link='manage/resolutions' to="/manage/resolutions">Resoluciones</router-link>
              <router-link class="navbar-item" :class="{ 'is-active': isactive == 'manage/countries' }"
                @click="selectItem" data-link='manage/countries' to="/manage/countries">Paises</router-link>
              <router-link class="navbar-item" :class="{ 'is-active': isactive == 'manage/chanels' }"
                @click="selectItem" data-link='manage/chanels' to="/manage/chanels">Canales</router-link>
              <router-link class="navbar-item" :class="{ 'is-active': isactive == 'manage/links' }" @click="selectItem"
                data-link='manage/links' to="/manage/links">Enlaces</router-link>
              <router-link class="navbar-item" :class="{ 'is-active': isactive == 'manage/newlinks' }" @click="selectItem"
                data-link='manage/newlinks' to="/manage/newlinks">Enlaces sugeridos</router-link>
            </div>
          </div>
          <router-link class="navbar-item" :class="{ 'is-active': isactive == 'hacerCosas' }" @click="selectItem"
            data-link='hacerCosas' to="/hacerCosas">Hacer cosas</router-link>
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