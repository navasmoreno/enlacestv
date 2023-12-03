<template>
  <p>Enlaces para Acestream</p>
  <div class="content">
    <div class="columns">
      <div class="column"></div>
      <div class="column is-three-quarters">
        <section class="accordions">
          <article v-for="item in items" class="accordion is-primary">
            <div class="accordion-header toggle">
              <p>[{{ item.id }}] {{ item.label || "" }}</p>
            </div>
            <div class="accordion-body">
              <div class="accordion-content">
                <div class="columns is-multiline is-mobile column-gap">
                  <div v-for="(chanel, key) in item.chanels" class="column column is-4">
                    <div class="card text-center">
                      <div class="card-content">
                        <div class="card-header">
                          <div class="card-header-title">
                            <font-awesome-icon icon="fa-solid fa-desktop" class="mr-1" />
                            {{ key }}
                          </div>
                        </div>
                        <div class="content pt-2">
                          <div class="buttons">
                            <a v-for="(link, index) in chanel" class="button is-link is-light is-medium" :title="link"
                              :href="link" rel="nofollow">
                              <div>Link {{ index + 1 }}</div>
                              <font-awesome-icon icon="fa-solid fa-up-right-from-square" />
                            </a>
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
      <div class="column"></div>
    </div>
  </div>
</template>

<script>
import links from "./assets/links.json";
import links2 from "./assets/links2.json";
import links3 from "./assets/links3.json";

import bulmaAccordion from 'bulma-extensions/bulma-accordion/dist/js/bulma-accordion.min.js'
import 'bulma-extensions/bulma-accordion/dist/css/bulma-accordion.min.css';

export default {
  name: 'CAnales',
  mounted: () => {
    console.log(process.env)
    this.accordions = bulmaAccordion.attach(); // accordions now contains an array of all Accordion instances

  },
  data() {
    // var items = links;
    var items = this.incluirCanales(links);
    items = this.incluirCanales(links2, items);
    items = this.incluirCanales(links3, items);
    return {
      items: items,
      accordions: []
    }
  },
  methods: {
    /**
     * Incluye los elementos origen en destino si no existen
     * @param {*} origen 
     * @param {*} destino 
     */
    incluirCanales(origen, destino = []) {
      origen = origen.sort((a, b) => {
        if (a.id > b.id) return 1;
        else if (a.id < b.id) return -1;
        else return 0;
      });
      for (var i in origen) {
        var item = origen[i];
        if (
          item.hasOwnProperty("id")
          && item.hasOwnProperty("chanels")
          && Object.keys(item.chanels).length > 0
          && Object.keys(item.chanels).some(chanel => item.chanels[chanel].some(link => link.length > 0))
        ) {
          var id = item.id;
          var chanels = Object.keys(item.chanels).sort((a, b) => {
            if (a.id > b.id) return 1;
            else if (a.id < b.id) return -1;
            else return 0;
          });
          if (destino.some(x => x.id == id)) {
            var index = destino.findIndex(x => x.id == id);
            chanels.forEach(chanel => {
              if (chanel.length > 0) {
                chanel = chanel.toUpperCase();
                if (destino[index].chanels.hasOwnProperty(chanel)) {
                  destino[index].chanels[chanel] = [...new Set(destino[index].chanels[chanel].concat(item.chanels[chanel].filter(x => x.trim().length > 0)))];
                } else if (item.chanels[chanel].length > 0) {
                  destino[index].chanels[chanel] = item.chanels[chanel].filter(x => x.trim().length > 0);
                }
              }
            });

          } else {
            var target = {
              id: id,
              label: item.label,
              chanels: {}
            }
            chanels.forEach(chanel => {
              chanel = chanel.toUpperCase();
              if (item.chanels[chanel].length > 0) {
                target.chanels[chanel] = item.chanels[chanel];
              }
            });
            if (Object.keys(target.chanels).length > 0) {
              destino.push(target);
            }
          }
        }
      }
      return destino;
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
}
</style>
