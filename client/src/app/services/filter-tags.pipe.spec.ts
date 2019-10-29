import { IDrawing } from '../../../../common/drawing-information/IDrawing';
import { FilterTagsPipe } from './filter-tags.pipe';

describe('FilterTagsPipe', () => {

  let pipe: FilterTagsPipe;
  let items: IDrawing[];
  let selectedTags: string[];

  beforeEach(() => {
    pipe = new FilterTagsPipe();
    items = [];
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all if all tags are selected', () => {
    selectedTags = ['all'];
    expect(pipe.transform(items, selectedTags)).toEqual(items);
  });

  it('should return false if no tags are present with selected name', () => {
    selectedTags = ['none'];
    expect(pipe.transform(items, selectedTags)).toEqual([]);
  });

  it('should return tags with with selected name if they exist', () => {
    selectedTags = ['tag'];
    expect(pipe.transform(items, selectedTags)).toEqual(items);
  });

});
