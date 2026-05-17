/**
 * Validadores reutilizables
 */

export class ValidatorUtil {
  static isValidLink(link) {
    try {
      new URL(link);
      return true;
    } catch {
      return false;
    }
  }

  static isValidCountryId(id) {
    return typeof id === 'string' && id.trim().length > 0 && id.length <= 6;
  }

  static isValidLabel(label) {
    return typeof label === 'string' && label.trim().length > 0 && label.length <= 200;
  }

  static isValidChanelName(name) {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 150;
  }

  static validateLink(linkData) {
    const errors = [];

    if (!linkData.link || !this.isValidLink(linkData.link)) {
      errors.push('URL de enlace inválida');
    }

    if (!linkData.chanel || typeof linkData.chanel !== 'object' || !linkData.chanel.id) {
      errors.push('Canal debe ser seleccionado');
    }

    if (!linkData.country || typeof linkData.country !== 'object' || !linkData.country.id) {
      errors.push('País debe ser seleccionado');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateCountry(countryData) {
    const errors = [];

    if (!this.isValidCountryId(countryData.id)) {
      errors.push('ID de país debe tener entre 1 y 6 caracteres');
    }

    if (!this.isValidLabel(countryData.label)) {
      errors.push('Etiqueta del país debe tener entre 1 y 200 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateChanel(chanelData) {
    const errors = [];

    if (!this.isValidChanelName(chanelData.name)) {
      errors.push('Nombre del canal debe tener entre 1 y 150 caracteres');
    }

    if (!chanelData.country || typeof chanelData.country !== 'object' || !chanelData.country.id) {
      errors.push('País debe ser seleccionado');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
