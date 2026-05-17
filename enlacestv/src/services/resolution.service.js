import { ServicesBase } from "./services-base";

const name = process.env.VUE_APP_COLLECTION_RESOLUTION_NAME || 'resolution';

export default class ResolutionService extends ServicesBase {
  static instance = null;

  constructor() {
    if (ResolutionService.instance) {
      return ResolutionService.instance;
    }
    super(name);
    ResolutionService.instance = this;
  }
}

export const resolutionService = new ResolutionService();