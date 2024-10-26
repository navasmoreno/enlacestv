import { ServicesBase } from "./services-base";
const name = process.env.VUE_APP_COLLECTION_LINKS_NAME;

export default class Links extends ServicesBase {
  constructor() {
    super(name);
  }
}