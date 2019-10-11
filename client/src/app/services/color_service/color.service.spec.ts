import { ColorService } from './color.service';

describe('ColorService ', () => {
    const color = jasmine.createSpyObj('ColorServiceSpy', ['switchColors', 'addColor', 'chooseColor', 'setAlpha', 'rgbToHex', 'setColor']);
    let instance: ColorService;

    beforeEach(() => {
        instance = new ColorService();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
      });

    it('should access color when addColor is called', () => {
        expect(instance.color).toHaveBeenCalled();
    });

    it('should access color when chooseColor is called', () => {
        color.chooseColor(true);
        spyOn(color, 'chooseColor').and.returnValue(true);
        expect(color).toHaveBeenCalled();
    });

    it('should turn a value of 0 into string 00', () => {
        expect(instance.rgbToHex(0)).toBe('00');
    });

    it('should turn a value of <16 into string 0 + hex value', () => {
        expect(instance.rgbToHex(15)).toBe('0f');
    });

    it('should turn a value of >15 into string hex value', () => {
        expect(instance.rgbToHex(16)).toBe('10');
    });

    it('should have default alpha = 1', () => {
        expect(instance.alpha[0]).toEqual(100);
        expect(instance.alpha[1]).toEqual(100);
    });

    it('should have defalut primary color = white', () => {
        expect(instance.color[0]).toEqual('#ffffffff');
    });

    it('should have default secondary color = black', () => {
        expect(instance.color[1]).toEqual('#000000ff');
    });

    it('should have last 10 colors be of length 10', () => {
        expect(instance.lastColors.length).toEqual(10);
    });

    it('should switch primary color with secondary color ', () => {
        expect(instance.switchColors()).toHaveBeenCalled();
    });

    it('should have last 10 colors be of length 10', () => {
        expect(instance.lastColors.length).toEqual(10);
    });

    it('should add color to when Alpha is changed', () => {
        color.lastColors =  ['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff'];
        color.setAlpha(0);
        expect(color.lastColors).toEqual(['#222222ff', '#444444ff', '#666666ff', '#888888',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff', '#ffffff00']);
    });

    it('should add color to lastColors', () => {
        color.lastColors =  ['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff'];
        color.addColor('#010101ff');
        expect(color.lastColors).toEqual(['#222222ff', '#444444ff', '#666666ff', '#888888',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff', '#010101ff']);
    });


    it('shouldnt add color to lastColors if color is already present in lastColors', () => {
        color.lastColors = ['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff'];
        color.addColor('#000000ff');
        expect(color.lastColors).toEqual(['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff']);
    });

    it('change color on setColor', () => {

    });
});
