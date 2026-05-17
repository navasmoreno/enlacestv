import { ServicesBase } from "./services-base";

const name = process.env.VUE_APP_COLLECTION_COUNTRIES_NAME || 'country';

export default class CountryService extends ServicesBase {
  static instance = null;

  constructor() {
    if (CountryService.instance) {
      return CountryService.instance;
    }
    super(name);
    CountryService.instance = this;
  }
}

export const countryService = new CountryService();