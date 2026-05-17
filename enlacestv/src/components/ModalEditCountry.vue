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
        <div v-if="this.item != null">
          <div class="container">
            <div class="columns">
              <div class="column is-full">
                <div class="is-flex is-flex-direction-column">
                  <div>
                    <label class="label has-text-left" for="countryid">Id de país</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="countryid" maxlength="6" :value="item.data.id" />
                  </div>
                  <div class="">
                    <label class="label has-text-left" for="countrylabel">Nombre de país</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="countrylabel" maxlength="200" :value="item.data.label" />
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
export default {
  name: "ModalEditCountry",
  props: ["item"],
  emits: ["callback"],
  watch: {
    item: function (newval, oldval) {
    },
  },
  data() {
    return {
      notifiactionMessage: null,
      showModal: false,
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
      if (document.getElementById("countryid")) document.getElementById("countryid").value = "";
      if (document.getElementById("countrylabel")) document.getElementById("countrylabel").value = "";
      this.notifiactionMessage = null;
    },
    validate() {
      this.notifiactionMessage = null;
      var countryid = document.getElementById("countryid").value.trim();
      var countrylabel = document.getElementById("countrylabel").value.trim();
      if (countryid.length == 0) {
        this.notifiactionMessage = "El ID no puede estar vacío";
        return false;
      } else if (countrylabel.length == 0) {
        this.notifiactionMessage = "El nombre delpaís no puede estar vacío";
        return false;
      }
      return true;
    },
    async save() {
      if (this.validate() === true) {
        this.item.data.id = document.getElementById("countryid").value.trim().toUpperCase();
        this.item.data.label = document.getElementById("countrylabel").value.trim().toUpperCase();
        this.$emit("callback", this.item);
      } else {
        return;
      }
    },
  },
};
</script>
<style></style>
