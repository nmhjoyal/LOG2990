import { Pipe, PipeTransform } from '@angular/core';
import { IDrawing } from '../../../../common/drawing-information/IDrawing';

@Pipe({
  name: 'filterTags',
})
export class FilterTagsPipe implements PipeTransform {
  transform(items: IDrawing[], selectedTags: string[]): IDrawing[] | boolean {
    if (selectedTags.includes('all')) {
      return items;
    } else {
      return items.filter((item) => {
        if (item.tags) {
          return item.tags.some((tag) => {
            return selectedTags.includes(tag.name);
          });
        }
        return false;
      });
    }
  }
}