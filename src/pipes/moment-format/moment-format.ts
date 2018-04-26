import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
@Pipe({
  name: 'momentFormat',
})
export class MomentFormatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  public transform(value: string, args: string) {
    args = args || 'LLLL';
    moment.locale('sv');
    return moment(value).format(args);
  }
}
