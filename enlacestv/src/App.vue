<template>
  <nav class="navbar has-background-grey-lighter" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <img src="@/assets/logo.png">
      </router-link>
      <router-link class="navbar-item" to="/links">Enlaces</router-link>
      <router-link class="navbar-item" to="/howtouse">Como usarlos</router-link>
    </div>
  </nav>
  <router-view></router-view>
</template>