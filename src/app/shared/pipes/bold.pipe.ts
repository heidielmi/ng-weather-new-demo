import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boldMatchingSection',
  pure: false
})
export class boldMatchingSectionPipe implements PipeTransform {
  transform(value: string, inputedValue: string): string {
    let reg = new RegExp('('+inputedValue+')', 'gi');
    return value.replace(reg, '<b>$1</b>');
  }
}