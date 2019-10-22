import { Pipe, PipeTransform } from '@angular/core';
import { IDrawing } from '../../../../common/drawing-information/IDrawing';

@Pipe({
  name: 'filterTags',
})
export class FilterTagsPipe implements PipeTransform {
  transform(items: IDrawing[], tag: string): IDrawing[] | boolean {
    if (tag === 'all') {
      return items;
    } else {
      return items.filter((item) => {
        if (item.tags) {
          for (let i = 0; i < item.tags.length; i++) {
            if (item.tags[i].name === tag) {
              console.log(tag + ' matches!!');
              return true;
            }
            return false;
          };
        }
        return false;
      });
    }
  }
}
