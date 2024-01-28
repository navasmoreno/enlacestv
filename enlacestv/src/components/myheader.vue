<template>
    <nav class="navbar has-background-grey-lighter is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link class="navbar-item" to="/">
                <img src="@/assets/logo.png">
            </router-link>
            <router-link class="navbar-item" to="/links">Enlaces</router-link>
            <router-link class="navbar-item" to="/newlink">Sugerir un enlance</router-link>
            <router-link class="navbar-item" to="/howtouse">Como usarlos</router-link>
            <!-- <router-link class="navbar-item" to="/about">Esto de quien es</router-link> -->
        </div>
    </nav>
</template>