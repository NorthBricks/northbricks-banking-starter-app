import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LowerCasePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'lowerCase',
})
export class LowerCasePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, args: string) {
    return value.toLowerCase();
  }
}
