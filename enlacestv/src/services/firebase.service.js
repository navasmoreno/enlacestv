import { initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseError, Logger } from '@/utils/errorHandler';

class FirebaseService {
  static instance = null;

  firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: process.env.VUE_APP_AUTHDOMAIN,
    projectId: process.env.VUE_APP_PROJECTID,
    storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_APPID,
  };

  constructor() {
    if (FirebaseService.instance) {
      return FirebaseService.instance;
    }

    try {
      const app = initializeApp(this.firebaseConfig);
      this.db = getFirestore(app);
      Logger.info('Firebase initialized successfully');
      FirebaseService.instance = this;
    } catch (error) {
      Logger.error('Firebase initialization failed', error);
      throw new FirebaseError(error);
    }
  }

  getCollection(name) {
    return collection(this.db, name);
  }

  async getDocItem(name, id) {
    try {
      const docRef = doc(this.db, name, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      Logger.error(`Failed to get document ${id} from ${name}`, error);
      throw new FirebaseError(error);
    }
  }

  async getAllDocs(name) {
    try {
      const querySnapshot = await getDocs(collection(this.db, name));
      Logger.debug(`Fetched ${querySnapshot.size} documents from ${name}`);
      return querySnapshot;
    } catch (error) {
      Logger.error(`Failed to fetch documents from ${name}`, error);
      throw new FirebaseError(error);
    }
  }

  async addCollectionDoc(name, data) {
    try {
      const id = Date.now() + Math.random().toString(36).slice(6);
      await setDoc(doc(this.db, name, id.trim()), data);
      Logger.info(`Document ${id} added to ${name}`, data);
      return id;
    } catch (error) {
      Logger.error(`Failed to add document to ${name}`, error);
      throw new FirebaseError(error);
    }
  }

  async updateCollectionDoc(name, id, data) {
    try {
      await setDoc(doc(this.db, name, id.trim()), data);
      Logger.info(`Document ${id} updated in ${name}`);
      return true;
    } catch (error) {
      Logger.error(`Failed to update document ${id} in ${name}`, error);
      throw new FirebaseError(error);
    }
  }

  async updateDocAttributes(name, id, data) {
    try {
      const docRef = doc(this.db, name, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error(`Document ${id} does not exist in ${name}`);
      }

      await updateDoc(docRef, data);
      Logger.info(`Document ${id} attributes updated in ${name}`, data);
      return true;
    } catch (error) {
      Logger.error(`Failed to update document attributes for ${id} in ${name}`, error);
      throw new FirebaseError(error);
    }
  }

  async updateDocAttribute(name, id, field, value) {
    const attribute = {};
    attribute[field] = value;
    return await this.updateDocAttributes(name, id, attribute);
  }

  async deleteCollectionDoc(name, id) {
    try {
      await deleteDoc(doc(this.db, name, id));
      Logger.info(`Document ${id} deleted from ${name}`);
      return true;
    } catch (error) {
      Logger.error(`Failed to delete document ${id} from ${name}`, error);
      throw new FirebaseError(error);
    }
  }

  reference(path) {
    return doc(this.db, path);
  }
}

// Singleton export
export const firebaseService = new FirebaseService();

// Class export para compatibilidad
export { FirebaseService };