import { ServicesBase } from "./services-base";
const name = "chanels";

export default class Chanels extends ServicesBase {
  constructor() {
    super(name, process.env.VUE_APP_LOCALSTORAGE_CHANELS);
  }
}