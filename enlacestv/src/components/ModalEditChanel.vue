<template>
  <div id="modal-link-add" class="modal" :class="{ 'is-active': this.showModal == 1 }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title m-0">Editar país</p>
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
        <div v-if="response != null && !!response.data">
          <div class="container">
            <div class="columns">
              <div class="column is-full">
                <div class="is-flex is-flex-direction-column">
                  <div>
                    <label class="label has-text-left" for="name">Nombre</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="name" maxlength="200" v-model="response.data.name" />
                  </div>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-full">
                <div class="">
                  <label class="label has-text-left" for="resolution">Resolución</label>
                </div>
                <div class="">
                  <input class="input is-uppercase" type="text" id="resolution" maxlength="6" v-model="response.data.resolution" />
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-full">
                <div class="">
                  <label class="label has-text-left" for="country">País</label>
                </div>
                <div class="select is-fullwidth">
                  <select class="" name="country" id="country" v-model="response.data.country">
                    <option value="0"></option>
                    <option v-for="country in countries" :value="country.id" :selected="country.id == response.data.country">[{{ country.data.id }}] {{ country.data.label }}</option>
                  </select>
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
export default {
  name: "ModalEditChanel",
  props: ["item", "countries"],
  emits: ["callback"],
  watch: {
    item: function (newval, oldval) {
      console.log(newval);
      this.response = newval;
      if (newval != null) {
        this.response = {
          id: newval.id,
          data: {
            name: newval.data.name,
            resolution: newval.data.resolution,
            country: newval.data.country == null ? 0 : newval.data.country.id,
          },
        };
      } else {
        this.response = null;
      }
    },
  },
  data() {
    return {
      notifiactionMessage: null,
      showModal: false,
      response: {},
    };
  },
  methods: {
    close() {
      this.showModal = false;
      this.clear();
    },
    open() {
      setTimeout(() => {
        this.showModal = true;
      }, 200);
    },
    clear() {
      // if (document.getElementById("countryid")) document.getElementById("countryid").value = "";
      // if (document.getElementById("countrylabel")) document.getElementById("countrylabel").value = "";
      this.notifiactionMessage = null;
    },
    validate() {
      this.notifiactionMessage = null;
      if (this.response.data.name.length == 0) {
        this.notifiactionMessage = "El nombre no puede estar vacío";
        return false;
      }
      if (this.response.data.country == 0) {
        this.notifiactionMessage = "El país no puede estar vacío";
        return false;
      }
      return true;
    },
    async save() {
      if (this.validate() === true) {
        this.$emit("callback", this.response);
      }
    },
  },
};
</script>
<style></style>
