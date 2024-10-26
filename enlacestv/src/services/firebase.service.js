import { initializeApp } from 'firebase/app';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc } from 'firebase/firestore';

export class FirebaseService {
  firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: process.env.VUE_APP_AUTHDOMAIN,
    projectId: process.env.VUE_APP_PROJECTID,
    storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_APPID,
  };

  constructor() {

    // Initialize Firebase
    const app = initializeApp(this.firebaseConfig);
    // const analytics = getAnalytics(app);
    this.db = getFirestore(app);
  }
  getCollection = (name) => {
    debugger;
    var data = collection(this.db, name);
    return data;
  }
  getDoc = async (name, id) => {
    const docRef = doc(this.db, name, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }
  async getAllDocs(name) {
    const q = query(collection(this.db, name));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }
  getDocs = async (query) => {
    const querySnapshot = await getDocs(query);
    return querySnapshot;
  }
  addCollectionDoc = async (name, data) => {
    try {
      var id = Date.now()+Math.random().toString(36).slice(6);
      await this.updateCollectionDoc(name, id.trim(), data);
      return id;
    } catch (error) {
      return false;
    }
  }
  updateCollectionDoc = async (name, id, data) => {
    try {
      await setDoc(doc(this.db, name, id.trim()), data);
      return true;
    } catch (error) {
      return false;
    }
  }
  deleteCollectionDoc = async (name, id) => {
    try {
      await deleteDoc(doc(this.db, name, id));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  reference = (path) => {
    return doc(this.db,path);
  }
}