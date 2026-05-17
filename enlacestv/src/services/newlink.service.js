import { ServicesBase } from "./services-base";

const name = process.env.VUE_APP_COLLECTION_NEWLINKS_NAME || 'newlink';

export default class NewLinkService extends ServicesBase {
  static instance = null;

  constructor() {
    if (NewLinkService.instance) {
      return NewLinkService.instance;
    }
    super(name);
    NewLinkService.instance = this;
  }
}

export const newLinkService = new NewLinkService();