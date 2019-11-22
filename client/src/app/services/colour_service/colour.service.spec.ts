import { ColourConstants } from 'src/app/drawing-view/components/tools/assets/constants/colour-constants';
// tslint:disable: no-string-literal
import { ColourService } from './colour.service';

describe('ColourService ', () => {
    const colour = jasmine.createSpyObj('ColourServiceSpy',
        ['switchColours', 'addColour', 'chooseColour', 'setAlpha', 'rgbToHex', 'setColour']);
    let instance: ColourService;

    beforeEach(() => {
        instance = new ColourService();
        instance['lastColours'] = ['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888ff',
            '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff'];
    });

    it('should return primary colour', () => {
        instance.colour[0] = '00';
        expect(instance.PrimaryColour).toEqual('00');
    });

    it('should return secondary colour', () => {
        instance.colour[1] = '00';
        expect(instance.SecondaryColour).toEqual('00');
    });

    it('should return primary opacity', () => {
        instance.alpha[0] = 0;
        expect(instance.PrimaryOpacity).toEqual(0);
    });

    it('should return secondary opacity', () => {
        instance.alpha[1] = 0;
        expect(instance.SecondaryOpacity).toEqual(0);
    });

    it('should turn a value of 0 into string 00', () => {
        expect(instance.rgbToHex(0)).toBe('00');
    });

    it('should turn a value of <16 into string 0 + hex value', () => {
        expect(instance.rgbToHex(ColourConstants.HEX_LENGTH - 1)).toBe('0f');
    });

    it('should turn a value of >15 into string hex value', () => {
        expect(instance.rgbToHex(ColourConstants.HEX_LENGTH)).toBe('10');
    });

    it('should have default alpha = 1', () => {
        expect(instance['alpha'][0]).toEqual(ColourConstants.INITIAL_TRANSPARENCY);
        expect(instance['alpha'][1]).toEqual(ColourConstants.INITIAL_TRANSPARENCY);
    });

    it('should have defalut primary colour = black', () => {
        expect(instance.colour[0]).toEqual('#000000ff');
    });

    it('should have default secondary colour = white', () => {
        expect(instance.colour[1]).toEqual('#ffffffff');
    });

    it('should switch primary colour with secondary colour ', () => {
        colour.switchColours();
        expect(colour.switchColours).toHaveBeenCalled();
    });

    it('should add colour to when Alpha is changed', () => {
        instance.setAlpha(0);
        instance.addColour();
        expect(instance['lastColours']).toEqual(['#222222ff', '#444444ff', '#666666ff', '#888888ff',
            '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff', '#00000000']);
    });

    it('should add colour to lastColours', () => {
        instance.setColour('#010101ff');
        instance.addColour();
        expect(instance['lastColours']).toEqual(['#222222ff', '#444444ff', '#666666ff', '#888888ff',
            '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff', '#010101ff']);
    });

    it('shouldnt add colour to lastColours if colour is already present in lastColours', () => {
        instance.setColour('#000000ff');
        expect(instance['lastColours']).toEqual(['#000000ff', '#222222ff', '#444444ff', '#666666ff', '#888888ff',
            '#aaaaaaff', '#bbbbbbff', '#ccccccff', '#eeeeeeff', '#ffffffff']);
    });

    it('change colour on setColour', () => {
        instance.setColour('#555555ff');
        expect(instance.colour[+instance['mainColour']]).toEqual('#555555ff');
    });

    it('should change mainColour to false if it is true', () => {
        instance.chooseColour(true);
        expect(instance['mainColour']).toEqual(true);
    });

    it('should change mainColour to true if it is false', () => {
        instance.chooseColour(false);
        expect(instance['mainColour']).toEqual(false);
    });
});
