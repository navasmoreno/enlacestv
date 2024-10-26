<template>
  <div id="modal-link-add" class="modal" :class="{ 'is-active': this.showModal == 1 }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title m-0">Agregar link</p>
        <!-- <button class="delete" aria-label="close"></button> -->
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="notifiactionMessage != null" class="columns">
          <div class="column">
            <div class="notification is-danger">
              {{ notifiactionMessage }}
            </div>
          </div>
        </div>
        <div v-if="!!this.item">
          <div class="container">
            <div class="columns">
              <div class="column has-text-left">
                <label class="has-text-weight-bold" for="datacountry">País propuesto</label>
              </div>
              <div class="column has-text-right">
                <p class="is-uppercase">{{ this.item.data.country }}</p>
              </div>
            </div>
            <div class="columns">
              <div class="column has-text-left">
                <label class="has-text-weight-bold" for="datachanel">Canal propuesto</label>
              </div>
              <div class="column has-text-right">
                <p class="is-uppercase">{{ this.item.data.chanel }}</p>
              </div>
            </div>
            <div class="columns">
              <div class="column has-text-left">
                <label class="has-text-weight-bold" for="datalink">Enlace</label>
              </div>
              <div class="column has-text-right">
                <p class="is-uppercase">{{ this.item.data.link }}</p>
              </div>
            </div>
            <hr>
            <div class="columns">
              <div class="column has-text-left">
                <label class="has-text-weight-bold" for="country">País</label>
              </div>
              <div class="column">
                <div class="select" style="width: 100%;">
                  <select id="country" style="width: 100%;" :value="countrySelected"
                    v-on:change="countrySelected = $event.target.value; clearChanel();">
                    <option value="0">Nuevo</option>
                    <option v-for="(country, index) in countries" :value="country.id">
                      [{{ country.data.id }}] {{ country.data.label || "" }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div v-if="countrySelected == 0" class="columns">
              <div class="column is-full">
                <div class="is-flex is-flex-direction-column">
                  <div>
                    <label class="label has-text-left" for="newcountryid">Id de país</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="newcountryid" maxlength="6" />
                  </div>
                  <div class="">
                    <label class="label has-text-left" for="newcountrylabel">Nombre de país</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="newcountrylabel" maxlength="200" />
                  </div>
                </div>
              </div>
            </div>
            <hr>
            <div class="columns">
              <div class="column has-text-left">
                <label class="has-text-weight-bold" for="chanel">Canales</label>
              </div>
              <div class="column">
                <div class="select" style="width: 100%;">
                  <select id="chanel" style="width: 100%;" :value="chanelSelected"
                    v-on:change="changeChanel($event.target.value)">
                    <option value="0">Nuevo</option>
                    <option v-for="(chanel, index) in chanels.filter(x => x.data.country.id == countrySelected)"
                      :value="chanel.id">
                      {{ chanel.data.name }}{{ chanel.data.resolution.length > 0 ? `[${chanel.data.resolution}]` : '' }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div v-if="chanelSelected == 0" class="columns">
              <div class="column is-full">
                <div class="is-flex is-flex-direction-column">
                  <div>
                    <label class="label has-text-left" for="newchanelname">Nombre</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="newchanelname" maxlength="200" />
                  </div>
                  <div class="">
                    <label class="label has-text-left" for="newchanelresolution">Resolución</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="newchanelresolution" maxlength="10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons is-justify-content-center is-flex-grow-1">
          <button class="button is-info is-light is-outlined" @click="save">Guardar</button>
          <button class="button is-danger is-light is-outlined" @click="close">Cancelar</button>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import CountryService from '../services/country.service';
import ChanelService from '../services/chanel.service';
import LinkService from '../services/link.service';

var country_service = new CountryService();
var chanel_service = new ChanelService();
var links_service = new LinkService();

export default {
  name: 'ModalLinkAdd',
  props: ['item'],
  emits: ['callback'],
  watch: {
    item: function (newval, oldval) {
      this.clear();
    }
  },
  data() {
    this.getData();
    return {
      countries: [],
      chanels: [],
      notifiactionMessage: null,
      showModal: false,
      countrySelected: 0,
      chanelSelected: 0
    }
  },
  methods: {
    async getData() {
      var countries = await country_service.getItems(true);
      if (countries.length > 0) this.countries = countries.sort((a, b) => a.data.label < b.data.label ? -1 : 1);
      var chanels = await chanel_service.getItems(true);
      if (chanels.length > 0) this.chanels = chanels.sort((a, b) => a.data.name < b.data.name ? -1 : 1);
    },
    close() {
      this.showModal = false;
      this.clear();
    },
    open() {
      this.showModal = true;
    },
    clear() {
      this.clearCountry();
      this.clearChanel();
      this.notifiactionMessage = null;
    },
    clearCountry() {
      this.countrySelected = 0;
      if (document.getElementById("newcountryid")) document.getElementById("newcountryid").value = "";
      if (document.getElementById("newcountrylabel")) document.getElementById("newcountrylabel").value = "";
    },
    clearChanel() {
      this.chanelSelected = 0;
      if (document.getElementById("newchanelname")) document.getElementById("newchanelname").value = "";
      if (document.getElementById("newchanelresolution")) document.getElementById("newchanelresolution").value = "";
    },
    changeChanel(id) {
      this.clearChanel();
      this.chanelSelected = id;
    },
    validate() {
      this.notifiactionMessage = null;
      var countryid = document.getElementById("newcountryid").value.trim().toUpperCase();
      var countrylabel = document.getElementById("newcountrylabel").value.trim().toUpperCase();
      //Nuevo pais
      if (document.getElementById("country").value == 0) {
        if (countryid.length == 0) {
          return "El nuevo id del nuevo canal no puede estar vacío";
        } else if (countrylabel.length == 0) {
          return "El nuevo nombre del nuevo canal no puede estar vacío";
        }
        if (this.countries.some(x => x.data.id.trim().toUpperCase() == countryid)) {
          return "El id de país ya existe";
        } else if (this.countries.some(x => x.data.label.trim().toUpperCase() == countrylabel)) {
          return "El nombre de país ya existe";
        }
      }
      //Nuevo canal
      if (document.getElementById("chanel").value == 0) {
        var chanelname = document.getElementById("newchanelname").value.trim().toUpperCase();
        if (chanelname.length == 0) {
          return "El nuevo canal no puede estar vacío";
        } else if (this.chanels.some(x => x.data.name.trim().toUpperCase() == chanelname)) {
          return "Este canal ya existe";
        }
      }
      return true;
    },
    async save() {
      var validate = this.validate();
      if (validate === true) {
        var country = document.getElementById("country").value;
        var chanel = document.getElementById("chanel").value;
        var chanelitem, countryitem, response = { country: "", chanel: "" };
        //Nuevo pais
        if (country == 0) {
          countryitem = {
            id: document.getElementById("newcountryid").value.trim().toUpperCase(),
            label: document.getElementById("newcountrylabel").value.trim().toUpperCase()
          }
          country = await country_service.addDoc(countryitem);
          response.country = `[${countryitem.id}] ${countryitem.label}`;
        } else {
          countryitem = this.countries.find(x => x.id == country);
          response.country = `[${countryitem.data.id}] ${countryitem.data.label}`;
        }
        //Nuevo canal
        if (chanel == 0) {
          chanelitem = {
            name: document.getElementById("newchanelname").value.trim().toUpperCase(),
            resolution: document.getElementById("newchanelresolution").value.trim().toUpperCase(),
            country: country_service.reference(country)
          }
          chanel = await chanel_service.addDoc(chanelitem);
          response.chanel = `${chanelitem.name}${chanelitem.resolution.length > 0 ? ` [${chanelitem.resolution}]` : ''}}`;
        } else {
          chanelitem = this.chanels.find(x => x.id == chanel);
          response.chanel = `${chanelitem.data.name}${chanelitem.data.resolution.length > 0 ? `[${chanelitem.data.resolution}]` : ''}`;
        }
        var newlink = {
          link: this.item.data.link,
          feed_up: 0,
          feed_down: 0,
          chanel: chanel_service.reference(chanel)
        }
        await links_service.addDoc(newlink);
        this.close();
        this.$emit('callback', response);
      } else {
        this.notifiactionMessage = validate;
        return;
      }
    }
  }
}
</script>
<style></style>