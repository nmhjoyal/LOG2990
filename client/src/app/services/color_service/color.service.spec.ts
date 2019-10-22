import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ColorService } from './color.service';

describe('ColorService ', () => {
    const color = jasmine.createSpyObj('ColorServiceSpy', ['switchColors', 'addColor', 'chooseColor', 'setAlpha', 'rgbToHex', 'setColor']);
    let instance: ColorService;

    beforeEach(() => {
        instance = new ColorService();
        instance.lastColors =  ['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888ff',
                            '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff'];
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
      });

    it('should turn a value of 0 into string 00', () => {
        expect(instance.rgbToHex(0)).toBe('00');
    });

    it('should turn a value of <16 into string 0 + hex value', () => {
        expect(instance.rgbToHex(NumericalValues.HEX_LENGTH - 1)).toBe('0f');
    });

    it('should turn a value of >15 into string hex value', () => {
        expect(instance.rgbToHex(NumericalValues.HEX_LENGTH)).toBe('10');
    });

    it('should have default alpha = 1', () => {
        expect(instance.alpha[0]).toEqual(NumericalValues.INITIAL_TRANSPARENCY);
        expect(instance.alpha[1]).toEqual(NumericalValues.INITIAL_TRANSPARENCY);
    });

    it('should have defalut primary color = black', () => {
        expect(instance.color[0]).toEqual('#000000ff');
    });

    it('should have default secondary color = white', () => {
        expect(instance.color[1]).toEqual('#ffffffff');
    });

    it('should switch primary color with secondary color ', () => {
        color.switchColors();
        expect(color.switchColors).toHaveBeenCalled();
    });

    it('should add color to when Alpha is changed', () => {
        instance.setAlpha(0);
        instance.addColor();
        expect(instance.lastColors).toEqual(['#222222ff', '#444444ff', '#666666ff', '#888888ff',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff', '#00000000']);
    });

    it('should add color to lastColors', () => {
        instance.setColor('#010101ff');
        instance.addColor();
        expect(instance.lastColors).toEqual(['#222222ff', '#444444ff', '#666666ff', '#888888ff',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff', '#010101ff']);
    });

    it('shouldnt add color to lastColors if color is already present in lastColors', () => {
        instance.setColor('#000000ff');
        expect(instance.lastColors).toEqual(['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888ff',
        '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff']);
    });

    it('change color on setColor', () => {
        instance.setColor('#555555ff');
        expect(instance.color[+instance.mainColor]).toEqual('#555555ff');
    });

    it('should change mainColor to false if it is true', () => {
        instance.chooseColor(true);
        expect(instance.mainColor).toEqual(true);
    });

    it('should change mainColor to true if it is false', () => {
        instance.chooseColor(false);
        expect(instance.mainColor).toEqual(false);
    });
});
