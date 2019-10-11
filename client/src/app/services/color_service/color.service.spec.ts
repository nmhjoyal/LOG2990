import { ColorService } from './color.service';

describe('ColorService ', () => {
    const color = jasmine.createSpyObj('ColorServiceSpy', ['switchColors', 'addColor', 'chooseColor']);
    let instance: ColorService;

    beforeEach(() => {
        instance = new ColorService();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
      });

    it('should access color when addColor is called', () => {
        color.addColor();
        expect(instance.color).toHaveBeenCalled();
    });

    it('should access color when chooseColor is called', () => {
        color.chooseColor(true);
        expect(instance.color[0]).toHaveBeenCalled();
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

    it('should have default primary color = black', () => {
        expect(instance.color[0]).toEqual('#000000ff');
    });

    it('should have last 10 colors be of length 10', () => {
        expect(instance.lastColors.length).toEqual(10);
    });

    it('should switch primary color with secondary color ', () => {
        expect(instance.switchColors).toBe(color.color[0]);
    });

    it('should have last 10 colors be of length 10', () => {
        expect(instance.lastColors.length).toEqual(10);
    });

    it('should add color when alpha is changed', () => {
        instance.setAlpha(1);
        expect(instance.addColor()).toHaveBeenCalled();
    });

    it('switch colors should switch colors', () => {
    
    });

    it('should change color when setAlpha is called', () => {

    });

    it('shouldnt add color if color is already present in lastColors', () => {

    });

    it('change color on setColor', () => {

    });
});
