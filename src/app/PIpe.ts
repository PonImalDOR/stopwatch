import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(seconds: number | null): string {
    if (seconds === null) {
      return '--:--'; // Placeholder for null value
    }

    const minutes: number = Math.floor(seconds / 60);
    const formattedMinutes: string = `${minutes < 10 ? '0' : ''}${minutes}`;
    const formattedSeconds: string = `${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
