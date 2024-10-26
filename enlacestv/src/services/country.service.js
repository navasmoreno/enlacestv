import { ServicesBase } from "./services-base";
const name = process.env.VUE_APP_COLLECTION_COUNTRIES_NAME;

export default class Countries extends ServicesBase {
  constructor() {
    super(name);
  }
}