import { FirebaseService } from "./firebase.service";

export class ServicesBase {
  constructor(
    name = "",
    StorageKey = null
  ) {
    this.StorageKey_name = `${name}_StorageKey`;
    if (StorageKey) this.StorageKey_value = StorageKey;
    else if (sessionStorage.getItem(this.StorageKey_name)) this.StorageKey_value = sessionStorage.getItem(this.StorageKey_name);
    else {
      this.StorageKey_value = Math.random().toString(36).slice(2);
      sessionStorage.setItem(this.StorageKey_name, StorageKey);
    }
    this.name = name;
    this.querySnapshot = null;
    this.firebaseService = new FirebaseService();
  }
  async getAllDocs(force = false) {
    if (this.querySnapshot == null || force == true) {
      this.querySnapshot = await this.firebaseService.getAllDocs(this.name);
    }
  }
  async getItems(force = false) {
    var items = [];
    var storageValues = sessionStorage.getItem(this.StorageKey_name);
    if (JSON.parse(sessionStorage.getItem(this.StorageKey_name)) == null || force == true) {
      if (this.querySnapshot == null || force) {
        await this.getAllDocs(force);
      }
      if (this.querySnapshot != null) {
        this.querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, data: doc.data() });
        });
      }
      sessionStorage.setItem(this.StorageKey_name, JSON.stringify(items));
    } else {
      items = JSON.parse(storageValues);
    }
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
      const item = this.querySnapshot.docs.find(item => item.id == id);
      if (!!item) return item.data();
    }
    return this.firebaseService.getDoc(this.name, id);
  }
  async updateDoc(id, data) {
    var response = await this.firebaseService.updateCollectionDoc(this.name, id.trim(), data);
    if (response == true) this.getItems(true);
    return response;
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
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
}
