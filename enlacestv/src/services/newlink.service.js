import { ServicesBase } from "./services-base";
const name = process.env.VUE_APP_COLLECTION_NEWLINKS_NAME;

export default class NewLink extends ServicesBase {
  constructor() {
    super(name);
  }
}