import { LocalStorageService } from './local-storage-service';

describe('LocalStorageService ', () => {
    let instance: LocalStorageService;

    beforeEach(() => {
        instance = new LocalStorageService();
    });

    it('should call storage setter', () => {
        spyOn(localStorage, 'setItem').and.callThrough();
        instance.setShowAgain('true');
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should access existing showAgain key', () => {
        spyOn(localStorage, 'getItem').and.returnValue('false');
        expect(instance.getShowAgain()).toBe(false);
        expect(localStorage.getItem).toHaveBeenCalled();
    });

    it('should initialize showAgain key', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        spyOn(localStorage, 'setItem').and.callThrough();
        expect(instance.getShowAgain()).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalled();
    });
});
