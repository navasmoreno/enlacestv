import { FirebaseService } from "./firebase.service";

export class ServicesBase {
  constructor(name = "", StorageKey = null) {
    this.name = name;
    this.querySnapshot = null;
    this.firebaseService = new FirebaseService();
  }
  async getAllDocs(force = false) {
    // if (this.querySnapshot == null || force == true) {
    this.querySnapshot = await this.firebaseService.getAllDocs(this.name);
    // }
  }
  async getItems(force = false) {
    var items = [];
    await this.getAllDocs(force);
    items = this.querySnapshot.docs.map((doc) => {
      var item = { id: doc.id, data: doc.data() };
      return item;
    });
    return items;
  }
  getCollection() {
    return this.firebaseService.getCollection(this.name);
  }

  async getDoc(id) {
    if (this.querySnapshot == null) {
      await this.getAllDocs();
    }
    if (this.querySnapshot != null) {
      const item = this.querySnapshot.docs.find((item) => item.id == id);
      if (!!item) return item.data();
    }
    return this.firebaseService.getDoc(this.name, id);
  }
  async updateDoc(id, data) {
    var response = await this.firebaseService.updateCollectionDoc(this.name, id.trim(), data);
    if (response == true) this.getItems(true);
    return response;
  }
  async updateDocAttribute(id, field, value) {
    if(this.querySnapshot.docs.some(item=>item.id == id)){
      const response = await this.firebaseService.updateDocAttribute(this.name,id,field,value);
      return response;
    }
    return false;
  }
  async addDoc(data) {
    var response = await this.firebaseService.addCollectionDoc(this.name, data);
    if (response !== false) this.getItems(true);
    return response;
  }
  async deleteDoc(id) {
    var response = await this.firebaseService.deleteCollectionDoc(this.name, id.trim());
    if (response == true) this.getItems(true);
    return response;
  }
  reference(id) {
    return this.firebaseService.reference(`${this.name}/${id}`);
  }
  setCookie(cname, cvalue) {
    let d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";";
  }
  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
}
