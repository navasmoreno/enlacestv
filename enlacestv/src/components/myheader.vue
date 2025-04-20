<template>
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="has-background-grey-lighter is-flex-direction-column is-flex-direction-row-widescreen navbar-brand is-flex-grow-1">
            <a id="navMenuBurger" role="button" class="is-align-self-flex-start m-0 mt-1 navbar-burger" data-target="navMenu"
                aria-label="menu" aria-expanded="false" @click="activeBurguer">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
            <div class="navbar-menu" id="navMenu">
                <div class="navbar-start" @click="selectItem">
                    <!-- navbar items -->
                    <router-link class="navbar-item is-hidden-touch" to="/">
                        <img src="@/assets/logo.png">
                    </router-link>
                    <router-link class="navbar-item" to="/links">Enlaces</router-link>
                    <router-link class="navbar-item" to="/newlink">Sugerir un enlance</router-link>
                    <router-link class="navbar-item" to="/howtouse">Como usarlos</router-link>
                </div>

                <div class="navbar-end">
                    <!-- navbar items -->
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
    },
    methods: {
        activeBurguer() {
            var el = document.getElementById('navMenuBurger');
            const $target = document.getElementById(el.dataset.target);
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
        },
        selectItem(event) {
            console.log(event.target);
            event.target.classList.toggle('is-active')
            this.activeBurguer();
        }
    }
}
</script>
<style></style>