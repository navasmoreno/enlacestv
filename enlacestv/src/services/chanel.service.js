import { ServicesBase } from "./services-base";
const name = process.env.VUE_APP_COLLECTION_CHANELS_NAME;

export default class Chanels extends ServicesBase {
  constructor() {
    super(name);
  }
}