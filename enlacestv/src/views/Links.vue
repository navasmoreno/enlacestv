<template>
    <div class="container is-fluid is-mobile">
      <div class="columns is-vcentered is-mobile">
        <div class="column is-8 is-offset-1 p-0">
          <div class="is-size-4-mobile is-size-3-tablet is-size-1-desktop">Enlaces para Acestream</div>
        </div>
        <div class="column is-2 is-pulled-right">
          <img class="image" src="@/assets/logo.png" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-10-desktop is-full is-offset-1-desktop p-0">
          <div class="">
            <section class="accordions">
              <article v-for="item in items" class="accordion is-primary">
                <div class="accordion-header toggle">
                  <div class="has-text-left has-text-weight-bold is-size-4 pl-4 " style="width: 100%;">[{{ item.id }}] {{
                    item.label || "" }}</div>
                </div>
                <div class="accordion-body">
                  <div class="accordion-content">
                    <div class="content">
                      <div class="columns is-multiline is-mobile column-gap">
                        <div v-for="(chanel, key) in item.chanels" class="column is-one-quarter-desktop">
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
                                  <div v-for="(link, index) in chanel" class="" style="width: 100%;">
                                    <a class="button is-link is-light is-medium is-full" :title="link" :href="link"
                                      rel="nofollow" style="width: 100%;">
                                      <p class="mr-3 mb-0 is-uppercase">Enlace {{ index + 1 }}</p>
                                      <font-awesome-icon icon="fa-solid fa-up-right-from-square" />
                                    </a>
                                    <div class="is-flex justify-content">
                                      <button class="button is-medium is-success is-flex-grow-1"
                                        v-on:click="setUp(index, key, item._id)">
                                        <font-awesome-icon icon="fa-solid fa-thumbs-up" />
                                        <div class="ml-2">{{ item.hasOwnProperty('feedback') &&
                                          item.feedback.hasOwnProperty(key) && index<item.feedback[key].length ?
                                          item.feedback[key][index].up : 0 }}</div>
                                      </button>
                                      <button class="button is-medium is-danger is-flex-grow-1"
                                        v-on:click="setDown(index, key, item._id)">
                                        <font-awesome-icon icon="fa-solid fa-thumbs-down" />
                                        <div class="ml-2">{{ item.hasOwnProperty('feedback') &&
                                          item.feedback.hasOwnProperty(key) && index<item.feedback[key].length ?
                                          item.feedback[key][index].down : 0 }}</div>
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
  var items = null;
  
  
  export default {
    name: 'Links',
    mounted: () => {
      bulmaAccordion.attach(); // accordions now contains an array of all Accordion instances
    },
    data() {
      var service = new ChanelService();
      this.getData(service);
      return {
        items: [],
        accordions: [],
        service: service
      }
    },
    methods: {
      getData(service) {
        var items = [];
        service.getItems().then(items => {
        console.log(items)
          this.items = this.incluirCanales(items);
          bulmaAccordion.attach();
        });
      },
      /**
       * Incluye los elementos origen en destino si no existen
       * @param {*} origen 
       * @param {*} destino 
       */
      incluirCanales(origen, destino = []) {
        origen = origen.sort((a, b) => {
          if (a.data.label > b.data.label) return 1;
          else if (a.data.label < b.data.label) return -1;
          else return 0;
        });
        for (var i in origen) {
          var item = origen[i].data;
          if (
            item.hasOwnProperty("id")
            && item.hasOwnProperty("chanels")
            && Object.keys(item.chanels).length > 0
            && Object.keys(item.chanels).some(chanel => item.chanels[chanel].some(link => link.length > 0))
          ) {
            var id = item.id;
            var chanels = Object.keys(item.chanels).sort((a, b) => {
              if (a > b) return 1;
              else if (a < b) return -1;
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
                _id: origen[i].id,
                id: id,
                label: item.label,
                chanels: {},
                feedback:item.feedback ?? {},
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
      },
      setUp(index, key, id) {
        this.setFeedback(true, id, key, index);
      },
      setDown(index, key, id) {
        this.setFeedback(false, id, key, index);
      },
      setFeedback(value = null, id, chanel, index) {
        var itemIndex = this.items.findIndex(x => x._id == id);
        if (itemIndex != -1) {
          if (this.items[itemIndex].hasOwnProperty("feedback") == false) {
            this.items[itemIndex].feedback = {};
          }
          if (this.items[itemIndex].feedback.hasOwnProperty(chanel) == false) {
            this.items[itemIndex].feedback[chanel] = [];
          }
          if (this.items[itemIndex].feedback[chanel].length < index + 1) {
            for (var i = this.items[itemIndex].feedback[chanel].length; i <= index; i++) {
              this.items[itemIndex].feedback[chanel][i] = { up: 0, down: 0 };
            }
          }
          if (value === true)
            this.items[itemIndex].feedback[chanel][index].up++;
          if (value === false)
            this.items[itemIndex].feedback[chanel][index].down++;
          var data = {...this.items[itemIndex]}
          delete data._id;
          this.service.addCollectionDoc(this.items[itemIndex]._id,data);
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
  }</style>
  