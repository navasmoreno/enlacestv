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
              <div class="column">
                <label for="datacountry">País propuesto</label>
              </div>
              <div class="column">
                <p>{{ this.item.data.country }}</p>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <label for="datacountry">Canal propuesto</label>
              </div>
              <div class="column">
                <p>{{ this.item.data.chanel }}</p>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <label for="datacountry">Enlace</label>
              </div>
              <div class="column">
                <p>{{ this.item.data.link }}</p>
              </div>
            </div>
            <hr>
            <div class="columns">
              <div class="column">
                <label for="country">País</label>
              </div>
              <div class="column">
                <div class="select" style="width: 100%;">
                  <select id="country" style="width: 100%;" @change="changeCountry($event.target.selectedIndex)">
                    <option value="">Nuevo</option>
                    <option v-for="(item, index) in items" :value="item.id" :data-id="item.data.id"
                      :data-label="item.data.label" :selected="index+1 == countrySelected">
                      [{{ item.data.id }}] {{ item.data.label }}
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
                    <input class="input" type="text" id="newcountryid" maxlength="6" />
                  </div>
                  <div class="">
                    <label class="label has-text-left" for="newcountrylabel">Nombre de país</label>
                  </div>
                  <div class="">
                    <input class="input" type="text" id="newcountrylabel" maxlength="200" />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <label for="chanel">Canales</label>
              </div>
              <div class="column">
                <div class="select" style="width: 100%;">
                  <select id="chanel" style="width: 100%;" @change="changeChanel($event.target.selectedIndex)">
                    <option value="">Nuevo</option>
                    <option v-for="(item, index) in chanels" :value="item" :selected="index+1 == chanelSelected">{{
                      item.toUpperCase() }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div v-if="chanelSelected == 0" class="columns">
              <div class="column is-full">
                <div class="is-flex is-flex-direction-column">
                  <div class="">
                    <label class="label has-text-left" for="newchanellabel">Nombre del canal</label>
                  </div>
                  <div class="">
                    <input class="input" type="text" id="newchanel" maxlength="200" />
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
    <!-- <div class="modal-content" style="height: auto;">
			<div class="box my-4" style="min-height: 400px;">
			</div>
		</div> -->
  </div>
</template>
<script>
import ChanelService from '../services/chanel.service';

export default {
  name: 'ModalLinkAdd',
  async beforeMount() {
    this.items = await this.service.getItems();
    console.log(this.items);
  },
  mounted() {
    // if(this.item)
    // 	this.changeCountry(this.item.id)
    this.countrySelected = 0;
    this.chanelSelected = 0;

  },
  updated() { },
  props: ['item'],
  emits: ['callback'],
  watch: {
    item: function (newval, oldval) {
      var country = document.getElementById("country");
      var chanel = document.getElementById("chanel");
      if (country) {
        country.value = "";
        this.countrySelected = 0;
      }
      if (chanel) {
        chanel.value = "";
        this.chanelSelected = 0;
      }
      if (newval) {
        var selectedIndex = this.items.findIndex(item => newval.data.country.toUpperCase() == item.data.id.toUpperCase() || newval.data.country.toUpperCase() == item.data.label.toUpperCase())
        this.changeCountry(selectedIndex + 1);
        if (chanel) {
          chanel.value = newval.data.chanel;
        }
      }
    }
  },
  data() {
    return {
      notifiactionMessage: null,
      showModal: false,
      service: new ChanelService(),
      chanels: {},
      items: [],
      countrySelected: 0,
      chanelSelected: 0
    }
  },
  methods: {
    close() {
      this.showModal = false;
      this.countrySelected = 0;
      this.chanelSelected = 0;
      if (document.getElementById("newcountryid")) document.getElementById("newcountryid").value = "";
      if (document.getElementById("newcountrylabel")) document.getElementById("newcountrylabel").value = "";
      if (document.getElementById("newchanel")) document.getElementById("newchanel").value = "";
    },
    open() {
      console.log(this.item)
      this.showModal = true;
      var selectedIndex = this.items.findIndex(i => {
        console.log(i,this.item);
       return this.item.data.country.toUpperCase() == i.data.id.toUpperCase() || this.item.data.country.toUpperCase() == i.data.label.toUpperCase()
      })
      this.changeCountry(selectedIndex + 1);
      selectedIndex = this.chanels.findIndex(x => x == this.item.data.chanel.toUpperCase())
      this.changeChanel(selectedIndex + 1);
    },
    changeCountry(selectedIndex) {
      this.countrySelected = selectedIndex;
      this.chanelSelected = 0;
      if (selectedIndex > 0) {
        this.chanels = Object.keys(this.items[selectedIndex - 1].data.chanels).sort();
      } else {
        this.chanels = {};
      }
      console.log("changeCountry", this.countrySelected, this.chanels);
    },
    changeChanel(selectedIndex) {
      this.chanelSelected = selectedIndex;
      console.log('changeChanel', selectedIndex, this.chanelSelected)
    },
    async save() {
      var data = null, id = null, countrytext = "", chaneltext = "";
      this.notifiactionMessage = null;
      if (document.getElementById("country").value == "") {//Nuevo pais
        if (document.getElementById("newcountryid").value.trim().length == 0) {
          this.notifiactionMessage = "El nuevo id del nuevo canal no puede estar vacío";
          return;
        } else if (document.getElementById("newcountrylabel").value.trim().length == 0) {
          this.notifiactionMessage = "El nuevo nombre del nuevo canal no puede estar vacío";
          return;
        }
        var countryid = document.getElementById("newcountryid").value.trim().replace("[", "").replace("]", "").toUpperCase();
        var countrytext = document.getElementById("newcountrylabel").value.trim().toUpperCase();
        if (this.items.find(x => x.data.id == countryid)) {
          this.notifiactionMessage = "El id de país ya existe";
          return;
        } else if (this.items.find(x => x.data.label == countrytext)) {
          this.notifiactionMessage = "El nombre de país ya existe";
          return;
        }
        data = {
          id: countryid,
          label: countrytext,
          chanels: {}
        }

      } else {
        id = document.getElementById("country").value;
        data = this.items.find(x => x.id == id).data;
        countrytext = document.getElementById("country").selectedOptions[0].dataset.label;
      }
      if (document.getElementById("chanel").value == "") {//Nuevo canal
        if (document.getElementById("newchanel").value.length == 0) {
          this.notifiactionMessage = "El nuevo canal no puede estar vacío";
          return;
        } else {
          var chanel = document.getElementById("newchanel").value.trim().toUpperCase();
          if (data.chanels.hasOwnProperty(chanel)) {
            this.notifiactionMessage = "Este canal ya existe";
            return;
          }
          data.chanels[chanel] = [this.item.data.link]
          chaneltext = chanel;
        }
      } else {
        if (data.chanels.hasOwnProperty(document.getElementById("chanel").value)) {
          if (data.chanels[document.getElementById("chanel").value].includes(this.item.data.link)) {
            this.notifiactionMessage = "Este enlace ya existe";
            return;
          }
          chaneltext = document.getElementById("chanel").value.trim();
          data.chanels[chaneltext].push(this.item.data.link)
        } else {
          this.notifiactionMessage = "Canal no encontroado";
          return;

        }
      }
      console.log('save', { chanel: chaneltext, country: countrytext });
      var response = true;
      if(id){
        response = await this.service.updateDoc(id, data);
      } else {
        response = await this.service.addDoc(data);
      }
      if(response){
        this.items = await this.service.getItems(true);
      }
      this.close();
      this.$emit('callback', response ? { chanel: chaneltext, country: countrytext } : false);
    }
  }
}
</script>
<style></style>