import { ServicesBase } from "./services-base";

const name = process.env.VUE_APP_COLLECTION_LINKS_NAME || 'link';

export default class LinkService extends ServicesBase {
  static instance = null;

  constructor() {
    if (LinkService.instance) {
      return LinkService.instance;
    }
    super(name);
    LinkService.instance = this;
  }
}

export const linkService = new LinkService();