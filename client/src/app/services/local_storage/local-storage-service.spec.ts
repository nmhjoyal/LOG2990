import { LocalStorageService } from './local-storage-service';

describe('LocalStorageService ', () => {
    let instance: LocalStorageService;
    const localStoragePrototype = Object.getPrototypeOf(window.localStorage);

    beforeEach(() => {
        instance = new LocalStorageService();
    });

    it('should call storage setter', () => {
        spyOn(localStoragePrototype, 'setItem').and.callThrough();
        instance.setShowAgain('true');
        expect(localStoragePrototype.setItem).toHaveBeenCalled();
    });

    it('should access existing showAgain key', () => {
        spyOn(localStoragePrototype, 'getItem').and.returnValue('false');
        expect(instance.getShowAgain()).toBe(false);
        expect(localStoragePrototype.getItem).toHaveBeenCalled();
    });

    it('should initialize showAgain key', () => {
        spyOn(localStoragePrototype, 'getItem').and.returnValue(null);
        spyOn(localStoragePrototype, 'setItem').and.callThrough();
        expect(instance.getShowAgain()).toBe(true);
        expect(localStoragePrototype.setItem).toHaveBeenCalled();
    });
});
