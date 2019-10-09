import { ColorService } from './color.service';

describe('ColorService ', () => {
    const color = jasmine.createSpyObj('ColorServiceSpy', ['get', 'set', 'has']);
    let instance: ColorService;

    beforeEach(() => {
        instance = new ColorService();
    });

    it('should call storage setter', () => {
        color.has.and.returnValue(true);
        instance.addColor();
        expect(color.get).toHaveBeenCalled();
    });

    it('should access existing showAgain key', () => {
        color.has.and.returnValue(true);
        color.get.and.returnValue(false);
        expect(instance.chooseColor(true)).toHaveBeenCalled();
        expect(color.get).toHaveBeenCalled();
    });

    it('should turn a value of 0 into string 00', () => {
        color.has.and.returnValue(false);
        expect(instance.rgbToHex(0)).toBe('00');
        expect(color.set).toHaveBeenCalled();
    });

    it('should have default alpha = 1', () => {
        expect(color.alpha[0]).toEqual('1');
        expect(color.alpha[1]).toEqual('1');
    });

    it('should have defalut primary color = white', () => {
        expect(color.color[0]).toEqual('#ffffffff');
    });

    it('should have default primary color = black', () => {
        expect(color.color[0]).toEqual('#000000ff');
    });

    it('should have last 10 colors be of length 10', () => {
        expect(color.lastColors.length).toEqual(10);
    });

    it('should switch primary color with secondary color ', () => {
        expect(color.switchColors).toBe(color.color[0]);
    });

    it('should have last 10 colors be of length 10', () => {
        expect(color.switchColors).toBe(color.color);
    });

    it('should call onClose when escape is pressed', () => {
        const spy = spyOn(color, 'onClose');
        expect(spy).toHaveBeenCalled();
      });

});
