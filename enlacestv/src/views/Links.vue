<template>
  <div class="container is-fluid is-mobile">
    <div class="columns is-vcentered is-mobile">
      <div class="column is-8 is-offset-1 p-0">
        <div class="is-size-4-mobile is-size-3-tablet is-size-1-desktop">
          Enlaces para Acestream
        </div>
      </div>
      <div class="column is-2 is-pulled-right">
        <img class="image" src="@/assets/logo.png" />
      </div>
    </div>
    <div class="columns">
      <div class="column is-10-desktop is-full is-offset-1-desktop p-0">
        <div class="">
          <section class="accordions">
            <article v-for="country in countries" class="accordion is-primary">
              <div class="accordion-header toggle">
                <div class="has-text-left has-text-weight-bold is-size-4 pl-4 " style="width: 100%;">
                  [{{ country.data.id }}] {{ country.data.label || "" }}
                </div>
              </div>
              <div class="accordion-body">
                <div class="accordion-content">
                  <div class="content">
                    <div class="columns is-multiline is-mobile column-gap">
                      <div v-for="chanel in chanels.filter(x => x.data.country.id == country.id)"
                        class="column is-one-quarter-desktop">
                        <div class="card text-center">
                          <div class="card-content">
                            <div class="card-header">
                              <div class="card-header-title">
                                <font-awesome-icon icon="fa-solid fa-desktop" class="mr-1" />
                                {{ chanel.data.name }}{{ chanel.data.resolution.length > 0 ? ` [${chanel.data.resolution}]` : '' }}
                              </div>
                            </div>
                            <div class="content pt-2">
                              <div class="buttons">
                                <div v-for="(link, index) in links.filter(x => x.data.chanel.id == chanel.id)" class=""
                                  style="width: 100%;">
                                  <a class="button is-link is-light is-medium is-full" :title="link.data.link"
                                    :href="link.data.link" rel="nofollow" style="width: 100%;">
                                    <p class="mr-3 mb-0 is-uppercase">Enlace {{ index + 1 }}</p>
                                    <font-awesome-icon icon="fa-solid fa-up-right-from-square" />
                                  </a>
                                  <div class="is-flex justify-content">
                                    <button class="button is-medium is-success is-flex-grow-1"
                                      v-on:click="setUp(link.id)">
                                      <font-awesome-icon icon="fa-solid fa-thumbs-up" />
                                      <div class="ml-2">{{ link.data.feed_up }}</div>
                                    </button>
                                    <button class="button is-medium is-danger is-flex-grow-1"
                                      v-on:click="setDown(item._id)">
                                      <font-awesome-icon icon="fa-solid fa-thumbs-down" />
                                      <div class="ml-2">{{ link.data.feed_down }}</div>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bulmaAccordion from 'bulma-extensions/bulma-accordion/dist/js/bulma-accordion.min.js'
import 'bulma-extensions/bulma-accordion/dist/css/bulma-accordion.min.css';
import ChanelService from '../services/chanel.service';
import CountryService from '../services/country.service';
import LinkService from '../services/link.service';

var chanels_service = new ChanelService();
var countries_service = new CountryService();
var links_service = new LinkService();


export default {
  name: 'Links',
  data() {
    this.getData();
    return {
      countries: [],
      chanels: [],
      links: [],
      accordions: [],
      spin: false
    }
  },
  methods: {
    async getData(force = false) {
      var countries = await countries_service.getItems(true);
      if (countries.length > 0) this.countries = countries.sort((a, b) => a.data.label < b.data.label ? -1 : 1);
      var chanels = await chanels_service.getItems(true);
      if (chanels.length > 0) this.chanels = chanels.sort((a, b) => a.data.name < b.data.name ? -1 : 1);
      this.links = await links_service.getItems(true);
      bulmaAccordion.attach();
    },
    setUp(id) {
      this.setFeedback(true, id);
    },
    setDown(id) {
      this.setFeedback(false, id);
    },
    setFeedback(value = null, id) {
      var link = this.links.find(x => x.id = id);
      if (link) {
        if (value === true)
          link.data.feed_up++;
        if (value === false)
          link.data.feed_down++;
        links_service.updateDoc(link.id, link.data);
      }
    }

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  .accordions .accordion.is-active .accordion-body {
    max-height: 100%;
  }
}
</style>