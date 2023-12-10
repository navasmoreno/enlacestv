import { FirebaseService } from "./firebase.service";

export class ServicesBase {
    constructor(
        name = ""
    ) {
        this.name = name;
        this.querySnapshot = null;
        this.firebaseService = new FirebaseService();
        this.getAllDocs();
    }
    async getAllDocs() {
        if (this.querySnapshot == null) {
            // console.log(`Buscando los items de ${this.name}`);
            this.querySnapshot = await this.firebaseService.getAllDocs(this.name);
        }
    }

    async getHeaderItems() {
        var items = [];
        if (this.querySnapshot == null) {
            await this.getAllDocs();
        }
        if (this.querySnapshot != null) {
            this.querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push(
                    { nombre: data['nombre'], link: doc.id }
                )
            });
        }
        return items;
    }
    async getItems() {
        var items = [];
        if (this.querySnapshot == null) {
            await this.getAllDocs();
        }
        if (this.querySnapshot != null) {
            this.querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
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
    async addCollectionDoc(id, data) {
        this.firebaseService.addCollectionDoc(this.name, id.trim(), data);
    }
}
