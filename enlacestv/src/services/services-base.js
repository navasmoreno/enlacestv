import { firebaseService } from "./firebase.service";
import { Logger, NotFoundError } from "@/utils/errorHandler";

export class ServicesBase {
  constructor(name = "") {
    this.name = name;
    this.querySnapshot = null;
  }

  async getAllDocs(force = false) {
    try {
      this.querySnapshot = await firebaseService.getAllDocs(this.name);
      Logger.debug(`Fetched all docs from ${this.name}`);
    } catch (error) {
      Logger.error(`Failed to fetch all docs from ${this.name}`, error);
      throw error;
    }
  }

  async getItems(force = false) {
    try {
      await this.getAllDocs(force);
      const items = this.querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      Logger.debug(`Retrieved ${items.length} items from ${this.name}`);
      return items;
    } catch (error) {
      Logger.error(`Failed to get items from ${this.name}`, error);
      throw error;
    }
  }

  getCollection() {
    return firebaseService.getCollection(this.name);
  }

  async getDoc(id) {
    try {
      if (!this.querySnapshot) {
        await this.getAllDocs();
      }

      if (this.querySnapshot) {
        const item = this.querySnapshot.docs.find((doc) => doc.id === id);
        if (item) {
          return item.data();
        }
      }

      // Si no está en cache, obtener del servidor
      const data = await firebaseService.getDocItem(this.name, id);
      if (!data) {
        throw new NotFoundError(this.name, id);
      }
      return data;
    } catch (error) {
      Logger.error(`Failed to get document ${id} from ${this.name}`, error);
      throw error;
    }
  }

  async updateDoc(id, data) {
    try {
      const response = await firebaseService.updateCollectionDoc(this.name, id.trim(), data);
      if (response) {
        await this.getAllDocs(true);
      }
      return response;
    } catch (error) {
      Logger.error(`Failed to update document ${id} in ${this.name}`, error);
      throw error;
    }
  }

  async updateDocAttributes(id, data) {
    try {
      if (!this.querySnapshot?.docs.some(doc => doc.id === id)) {
        throw new NotFoundError(this.name, id);
      }
      return await firebaseService.updateDocAttributes(this.name, id, data);
    } catch (error) {
      Logger.error(`Failed to update attributes for document ${id} in ${this.name}`, error);
      throw error;
    }
  }

  async updateDocAttribute(id, field, value) {
    try {
      if (!this.querySnapshot?.docs.some(doc => doc.id === id)) {
        throw new NotFoundError(this.name, id);
      }
      return await firebaseService.updateDocAttribute(this.name, id, field, value);
    } catch (error) {
      Logger.error(`Failed to update attribute ${field} for document ${id} in ${this.name}`, error);
      throw error;
    }
  }

  async addDoc(data) {
    try {
      const response = await firebaseService.addCollectionDoc(this.name, data);
      if (response) {
        await this.getAllDocs(true);
      }
      return response;
    } catch (error) {
      Logger.error(`Failed to add document to ${this.name}`, error);
      throw error;
    }
  }

  async deleteDoc(id) {
    try {
      const response = await firebaseService.deleteCollectionDoc(this.name, id.trim());
      if (response) {
        await this.getAllDocs(true);
      }
      return response;
    } catch (error) {
      Logger.error(`Failed to delete document ${id} from ${this.name}`, error);
      throw error;
    }
  }

  reference(id) {
    return firebaseService.reference(`${this.name}/${id}`);
  }
  referenceByPath(idOrPath) {
    const path = typeof idOrPath === 'string' && idOrPath.startsWith('/')
      ? idOrPath.replace(/^[\/]+/, '')
      : `${this.name}/${idOrPath}`;
    return firebaseService.reference(path);
  }
}
