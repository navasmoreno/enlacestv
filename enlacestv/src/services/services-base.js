import { FirebaseService } from "./firebase.service";

export class ServicesBase {
  constructor(
    name = "",
    StorageKey
  ) {
    if (StorageKey) this.StorageKey = StorageKey;
    else if (this.sessionStorage.get('StorageKey')) this.StorageKey = this.sessionStorage.get('StorageKey');
    else {
      this.StorageKey = Math.random().toString(36).slice(2);
      this.sessionStorage.set('StorageKey', StorageKey);
    }
    this.name = name;
    this.querySnapshot = null;
    this.firebaseService = new FirebaseService();
    // this.getAllDocs();
  }
  async getAllDocs(force = false) {
    if (this.querySnapshot == null || force == true) {
      this.querySnapshot = await this.firebaseService.getAllDocs(this.name);
    }
  }
  async getItems(force = false) {
    var items = [];
    // var storageValues = this.getCookie(this.StorageKey);
    var storageValues = sessionStorage.getItem(this.storageValues);
    if (storageValues == null || force == true) {
      if (this.querySnapshot == null || force) {
        await this.getAllDocs(force);
      }
      if (this.querySnapshot != null) {
        this.querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, data: doc.data() });
        });
      }
      // this.setCookie(this.StorageKey,JSON.stringify(items));
      sessionStorage.setItem(this.StorageKey, JSON.stringify(items));
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
    return await this.firebaseService.updateCollectionDoc(this.name, id.trim(), data);
  }
  async addDoc(data) {
    return await this.firebaseService.addCollectionDoc(this.name, data);
  }
  async deleteDoc(id) {
    return await this.firebaseService.deleteCollectionDoc(this.name, id.trim());
  }
  setCookie(cname, cvalue) {
    let d = new Date();
    d.setMinutes(d.getMinutes() + 5);
    let expires = "expires=" + d.toUTCString();
    console.log(cname + "=" + cvalue + ";" + expires + ";")
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
