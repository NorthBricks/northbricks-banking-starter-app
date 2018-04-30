import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';
/**
 * Generated class for the FormatCurrencyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatCurrency',
})
export class FormatCurrencyPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  public transform(value: string, args: string) {

    let num = numeral(value).format('0,0.00');
    // console.log('Currency ' + num)
    return num;
  }
}
