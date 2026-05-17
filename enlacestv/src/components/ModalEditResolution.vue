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
                  <div class="">
                    <label class="label has-text-left" for="value">Resolución</label>
                  </div>
                  <div class="">
                    <input class="input is-uppercase" type="text" id="value" maxlength="200" :value="item.data.value" />
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
  name: "ModalEditResolution",
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
      if (document.getElementById("value")) document.getElementById("value").value = "";
      this.notifiactionMessage = null;
    },
    validate() {
      this.notifiactionMessage = null;
      var value = document.getElementById("value").value.trim();
      if (value.length == 0) {
        this.notifiactionMessage = "El nombre delpaís no puede estar vacío";
        return false;
      }
      return true;
    },
    async save() {
      if (this.validate() === true) {
        this.item.data.value = document.getElementById("value").value.trim().toUpperCase();
        this.$emit("callback", this.item);
      } else {
        return;
      }
    },
  },
};
</script>
<style></style>
