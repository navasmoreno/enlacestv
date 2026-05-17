<template>
  <div id="modal-link-add" class="modal" :class="{ 'is-active': this.showModal == 1 }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title m-0">Editar link</p>
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
        <div v-if="response != null">
          <div class="container">
            <div class="columns">
              <div class="column is-one-fifth has-text-left">
                <label class="has-text-weight-bold" for="link">Enlace</label>
              </div>
              <div class="column">
                <input class="input" id="link" type="text" v-model="response.data.link" />
              </div>
            </div>
            <div class="columns">
              <div class="column is-one-fifth has-text-left">
                <label class="has-text-weight-bold" for="link">Resolución</label>
              </div>
              <div class="column">
                <div class="select is-fullwidth">
                  <select id="resolution" :value="response.data.resolution"
                    v-on:change="response.data.resolution = $event.target.value">
                    <option value="0"></option>
                    <option v-for="resolution in resolutions" :value="resolution.data.value">{{ resolution.data.value }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-one-fifth has-text-left">
                <label class="has-text-weight-bold" for="country">País</label>
              </div>
              <div class="column">
                <div class="select is-fullwidth">
                  <select id="country" :value="response.data.country" v-on:change="
                    response.data.country = $event.target.value;
                  response.data.chanel = 0;
                  ">
                    <option value="0"></option>
                    <option v-for="country in countries" :value="country.id">[{{ country.data.id }}] {{
                      country.data.label || "" }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="columns">
              <div class="column is-one-fifth has-text-left">
                <label class="has-text-weight-bold" for="chanel">Canal</label>
              </div>
              <div class="column">
                <div class="select is-fullwidth">
                  <select id="chanel" :value="response.data.chanel"
                    v-on:change="response.data.chanel = $event.target.value">
                    <option value="0"></option>
                    <option v-for="chanel in chanels.filter((x) => x.data.country.id == response.data.country)"
                      :value="chanel.id">
                      {{ chanel.data.name }}{{ chanel.data.resolution.length > 0 ? `[${chanel.data.resolution}]` : "" }}
                    </option>
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
  name: "ModalLinkEdit",
  props: ["item", "countries", "chanels", "resolutions"],
  emits: ["callback"],
  watch: {
    item: function (newval) {
      console.log(newval);
      this.response = {
        id: null,
        data: {
          link: "",
          resolution: "",
          chanel: 0,
          country: 0,
        },
      };
      if (newval != null) {
        this.response.id = newval.id;
        this.response.data = newval.data;
        this.response.data.resolution = newval.data.resolution ? newval.data.resolution : "";
        this.response.data.chanel = newval.data.chanel ? newval.data.chanel.id : 0;
        this.response.data.country = this.response.data.chanel != 0 ? this.chanels.find((x) => x.id == this.response.data.chanel).data.country.id : 0;
      }
    },
  },
  data() {
    return {
      notifiactionMessage: null,
      showModal: false,
      response: {
        id: null,
        data: {
          link: "",
          resolution: "",
          chanel: 0,
          country: 0,
        },
      },
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
      this.notifiactionMessage = null;
      this.countrySelected = 0;
      this.chanelSelected = 0;
      this.response = {
        id: null,
        data: {
          link: "",
          resolution: "",
          chanel: 0,
          country: 0,
        },
      };
    },
    validate() {
      this.notifiactionMessage = null;
      if (this.response.data.link.trim().length == 0) {
        this.notifiactionMessage = "El enlace no puede estar vacío";
      }
      if (this.response.data.chanel == 0) {
        this.notifiactionMessage = "El canal no puede estar vacío";
      }
      return this.notifiactionMessage == null || this.notifiactionMessage.length == 0;
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
