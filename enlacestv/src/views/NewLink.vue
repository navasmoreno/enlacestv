<template>
  <div class="container is-fluid is-mobile has-text-left pt-6" id="containerForm">
    <div v-if="notifiactionMessage != null" class="columns">
      <div class="column is-6 is-offset-3">
        <div class="notification" :class="notifiactionType">
          {{ notifiactionMessage }}
        </div>
      </div>
    </div>
    <div class="columns is-vcentered">
      <div class="column is-6 is-offset-3">
        <form id="newlinkform" class="is-size-6" v-on:submit.prevent="sendData">
          <div class="field">
            <label class="label is-large">País</label>
            <div class="control">
              <input class="input is-large" type="text" id="country" placeholder="Nombre del país" required>
            </div>
            <small>Ejemplo: España o ES</small>
          </div>
          <div class="field">
            <label class="label is-large">Canal</label>
            <div class="control">
              <input class="input is-large" type="text" id="chanel" placeholder="Nombre del canal" required>
            </div>
          </div>
          <div class="field">
            <label class="label is-large">URL del Enlace. </label>
            <div class="control">
              <input class="input is-large" type="text" id="link" placeholder="Enlace de acestream" required pattern="^(acestream:\/\/)([a-zA-Z0-9]+)$">
            </div>
            <small>Formato valido: acestream://36cad67fed5a739757a9db844a551aa845a8d51b</small>
          </div>

          <div class="field is-grouped mt-6">
            <div class="control">
              <button type="submit" class="button is-link is-large">Enviar</button>
            </div>
            <div class="control">
              <button type="reset" class="button is-link is-large is-light">Cancelar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="container is-hidden" style="font-size: 20rem; height: 100%;" id="containerSpinner">
    <span class="icon is-large">
      <font-awesome-icon icon="fa-solid fa-spinner" spin />
    </span>
  </div>
</template>
<script>
import NewLinkService from '../services/newlink.service';
export default {
  name: 'NewLink',
  mounted() {
    document.getElementById("country").focus();
  },
  data() {
    var service = new NewLinkService();
    return {
      service: service,
      notifiactionMessage: null,
      notifiactionType: "is-info"
    }
  },
  methods: {
    changeContainer: function () {
      var containerForm = document.getElementById("containerForm");
      var containerSpinner = document.getElementById("containerSpinner");
      if (containerForm.classList.contains('is-hidden')) {
        containerForm.classList.remove('is-hidden');
        containerSpinner.classList.add('is-hidden');
      } else {
        containerForm.classList.add('is-hidden');
        containerSpinner.classList.remove('is-hidden');
      }
    },
    sendData: function () {
      this.changeContainer();
      this.notifiactionMessage = null;
      
      const data = {
        country: document.getElementById("country").value.toUpperCase(),
        chanel: document.getElementById("chanel").value.toUpperCase(),
        link: document.getElementById("link").value,
        state: 0,
        created:false,
        createdon: new Date().toISOString()
      }
      this.service.addDoc(data).then(response => {
        this.changeContainer();
        this.notifiactionType = "is-primary";
        this.notifiactionMessage = "Solicitud enviada";
      });
    }
  }
}
</script>
<style></style>