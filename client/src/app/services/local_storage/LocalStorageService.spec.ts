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
});
