<template>
  <div class="container is-fluid is-mobile has-text-left mt-2">
    <div class="columns is-vcentered is-mobile">
      <div class="column is-8 is-offset-1 p-0">
        <div class="is-size-4-mobile is-size-3-tablet is-size-2-desktop">
          <p>
            Enlaces sugeridos
            <font-awesome-icon icon="fa-solid fa-rotate-right" :class="{ 'fa-spin': spin }" class="is-clickable is-rounded mt-1 p-1 is-inverted is-info"
              @click="getData(this.service, true)" title="Recargar elementos" />
          </p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-10-desktop is-full is-offset-1-desktop p-0">
        <table class="table is-narrow is-hoverable">
          <thead>
            <tr>
              <th>País</th>
              <th>Canal</th>
              <th>Link</th>
              <th class="has-text-centered" style="width: 250px;">Verificado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :data-id="item.id">
              <td class="is-uppercase">
                {{ item.data.country }}
              </td>
              <td class="is-uppercase">
                {{ item.data.chanel }}
              </td>
              <td class="is-uppercase">
                {{ item.data.link }}
              </td>
              <td>
                <div class="is-flex is-justify-content-space-evenly">
                  <div class="buttons has-addons center">
                    <button class="button"
                      :class="{ 'is-success is-selected': item.data.hasOwnProperty('state') && item.data.state == 1 }"
                      @click="changeState(item.id, 1)" :disabled="!!item.data.created">Si</button>
                    <button class="button"
                      :class="{ 'is-danger is-selected': !item.data.hasOwnProperty('state') || item.data.state == 0 }"
                      @click="changeState(item.id, 0)" :disabled="!!item.data.created">No</button>
                  </div>
                  <div v-if="item.data.hasOwnProperty('state') && item.data.state == 1">
                    <button class="button is-success" :disabled="!!item.data.created"
                      @click="add(item.id)" data-target="modal-js-example">
                      <font-awesome-icon icon="fa-solid fa-plus" />
                    </button>
                  </div>
                  <div v-if="!item.data.hasOwnProperty('state') || item.data.state == 0">
                    <button class="button is-danger" @click="deleteNewLink(item.id)">
                      <font-awesome-icon icon="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
  <ModalLinkAdd ref="modal" :item="this.modalItem" @callback="linkSaved"></ModalLinkAdd>
  <ModalAlert ref="alert_modal" :type="this.modaltype" :content="this.modalcontent" @callback="deleteSelectedItem">
  </ModalAlert>
</template>
  
<script>
import ModalAlert from '@/components/ModalAlert.vue';
import ModalLinkAdd from '@/components/ModalLinkAdd.vue';
import NewLinkService from '@/services/newlink.service';

export default {
  name: 'NewLinks',
  beforeMount: () => {
  },
  mounted: () => {
  },
  data() {
    var service = new NewLinkService();
    this.getData(service);
    return {
      items: [],
      service: service,
      modalItem: null,
      modaltype: null,
      modalcontent: "",
      selectedIndex: null,
      spin: false
    };
  },
  methods: {
    getData(service, force = false) {
      this.spin = true;
      service.getItems(force).then(result => {
        this.items = result;
        setTimeout(() => {
          this.spin = false;
        }, 1000);
      });
    },
    changeState(id, state) {
      var index = this.items.findIndex(x => x.id == id);
      this.items[index].data['state'] = state;
      this.service.updateDoc(id, this.items[index].data);
    },
    add(id) {
      this.modalItem = this.items.find(x => x.id == id);
      if (this.modalItem) {
        setTimeout(() => {
          this.$refs.modal.open();          
        }, 200);
      }
    },
    remove(id) {
    },
    deleteNewLink(id) {
      this.selectedIndex = this.items.findIndex(x => x.id == id);
      if (this.selectedIndex >= 0) {
        this.modaltype = "confirm_yesno";
        this.modalcontent = "Va a borrar este elemento, ¿Continuar?";
        this.$refs.alert_modal.open();
      }
    },
    async deleteSelectedItem(value) {
      if (value && this.selectedIndex != null) {
        this.service.deleteDoc(this.items[this.selectedIndex].id).then(response => {
          console.log(response)
          if (response) {
            this.getData(this.service, true);
          }
          this.selectedIndex = null;
        })
      }
    },
    linkSaved(response) {
      console.log(response);
      this.modaltype = "alert";
      if (response) {
        this.modalcontent = "Link guardado";
        this.selectedIndex = this.items.findIndex(x=>x.id==this.modalItem.id);
        this.items[this.selectedIndex].data.created=true;
        this.items[this.selectedIndex].data.chanel=response.chanel;
        this.items[this.selectedIndex].data.country=response.country;
        this.service.updateDoc(this.items[this.selectedIndex].id,this.items[this.selectedIndex].data);
      } else {
        this.modalcontent = "Error al guardar";
      }
      this.$refs.alert_modal.open();
    }
  },
  components: { ModalLinkAdd, ModalAlert }
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
  