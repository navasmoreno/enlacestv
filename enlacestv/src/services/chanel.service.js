import { ServicesBase } from "./services-base";

const name = process.env.VUE_APP_COLLECTION_CHANELS_NAME || 'chanel';

export default class ChanelService extends ServicesBase {
  static instance = null;

  constructor() {
    if (ChanelService.instance) {
      return ChanelService.instance;
    }
    super(name);
    ChanelService.instance = this;
  }
}

export const chanelService = new ChanelService();