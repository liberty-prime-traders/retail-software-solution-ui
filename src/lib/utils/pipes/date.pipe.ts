import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string | null {
    if (!value) return null;

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    // Format the date using the options provided
    return date.toLocaleString('en-US', options);
  }
}
