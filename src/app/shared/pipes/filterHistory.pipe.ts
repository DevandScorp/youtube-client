import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'filterHistory'
})
export class FilterHistoryPipe implements PipeTransform {
  transform(historyElements: string[], searchString= ''): string[] {
    if (!searchString.trim()) return historyElements;
    return historyElements.filter(historyElement => historyElement.toLowerCase().includes(searchString.toLowerCase()));
  }

}
