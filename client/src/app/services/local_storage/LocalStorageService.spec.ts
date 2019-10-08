import { LocalStorageService } from './LocalStorageService';

describe('LocalStorageService ', () => {
    const storage = jasmine.createSpyObj('StorageService', ['get', 'set', 'has']);
    let instance: LocalStorageService;

    beforeEach(() => {
        instance = new LocalStorageService(storage);
    });

    it('should call storage setter', () => {
        storage.get.and.returnValue(true);
        instance.setShowAgain(true);
        expect(storage.set).toHaveBeenCalled();
    });

    it('should access existing showAgain key', () => {
        storage.has.and.returnValue(true);
        storage.get.and.returnValue(false);
        expect(instance.getShowAgain()).toBe(false);
        expect(storage.get).toHaveBeenCalled();
    });

    it('should initialize showAgain key', () => {
        storage.has.and.returnValue(false);
        expect(instance.getShowAgain()).toBe(true);
        expect(storage.set).toHaveBeenCalled();
    });

    // THESE TESTS ARE TO BE TRANSFERRED TO TOOLHANDLERSERVICE.SPEC.TS

    it('should propely access the secondary color', () => {
        const color = instance.SecondColor;
        expect(color).toBe(instance.secondaryColor);
    });

    it('should propely access the primary color', () => {
        const color = instance.PrimaryColor;
        expect(color).toBe(instance.primaryColor);
    });

    it('should identify if it is a rectangle', () => {
        const rect = instance.isRectangle;
        expect(rect).toEqual(instance.rectangleSelected);
    });

    it('should reset whether the rectangle is selected when selecting another object', () => {
        const reset = spyOn(instance, 'reset');
        instance.chooseOther();
        expect(reset).toHaveBeenCalled();
    });

    it('should correctly select the rectangle and reset others when the tool is selected', () => {
        const reset = spyOn(instance, 'reset');
        instance.chooseRectangle();
        expect(reset).toHaveBeenCalled();
        expect(instance.rectangleSelected).toBe(true);
    });

    it('should set rectangleSelected to false on reset()', () => {
        instance.rectangleSelected = true;
        instance.reset();
        expect(instance.rectangleSelected).toBe(false);
    });

    it('should call reset and clear all rectangles on clear', () => {
        const reset = spyOn(instance, 'reset');
        instance.clear();
        expect(instance.rectangles.length).toEqual(0);
        expect(reset).toHaveBeenCalled();
    });

});
