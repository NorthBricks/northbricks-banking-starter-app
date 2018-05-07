import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CurrencySymbolPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'currencySymbol',
})
export class CurrencySymbolPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  public transform(value: string, currency: string) {
    switch (value.toLowerCase()) {
      case 'eur':
        return "€"
      default:
        return ""

    }
  }
}
