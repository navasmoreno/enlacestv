import { ServicesBase } from "./services-base";
const name = "chanels_new";

export default class NewLink extends ServicesBase {
  constructor() {
    super(name, process.env.VUE_APP_LOCALSTORAGE_CHANELS_NEWLINKS);
  }
}