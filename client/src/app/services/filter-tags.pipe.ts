import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTags',
})
export class FilterTagsPipe implements PipeTransform {
  transform(items: any[], tag: string):any {
    if (tag === 'all') {
      return items;
    } else {
      return items.filter((item) => {
        console.log(tag + ' matches!!')
        return item.name === tag;
      });
    }
  }
}
