// import SpyObj = jasmine.SpyObj;
// import { ShapeAbstract } from './shape-abstract';
// import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';

// class ShapeTest extends ShapeAbstract {

//   constructor(serviceInstance: LocalStorageService) {
//     super(serviceInstance);
//   }

//   // mock of abstract methods
//   saveShape(): void{
//     return;
//   }
//   calculateDimensions(): void{
//     return;
//   }
// }

// describe('ShapeAbstract', () => {
//   let ShapeTest: ShapeTest;
//   let storage: SpyObj<LocalStorageService>;
//   beforeEach(() => {
//     ShapeTest = new ShapeTest(storage);
//   });

//   it('should create an instance of the derived class', () => {
//     expect(new ShapeTest()).toBeTruthy();
//   });

//   it('should call onMouseDown when left mouse button is pressed', () => {
//     const spy = spyOn(ShapeTest, 'onMouseDown');
//     const event = new MouseEvent('mousedown');
//     dispatchEvent(event);
//     ShapeTest.onMouseDown(event);
//     expect(spy).toHaveBeenCalled();
//   });

//   it('should call onMouseUp when mousedown is true and mouse leaves', () => {
//     const spy = spyOn(ShapeTest, 'onMouseUp');
//     const mouseDownEvent = new MouseEvent('mousedown');
//     const event = new MouseEvent('mouseleave');
//     dispatchEvent(mouseDownEvent);
//     ShapeTest.onMouseDown(mouseDownEvent);
//     dispatchEvent(event);
//     ShapeTest.onMouseLeave();
//     expect(spy).toHaveBeenCalled();
//   });

//   it('should call onMouseUp when mousedown is true and the mousebutton gets released', () => {
//     const spy = spyOn(ShapeTest, 'onMouseUp');
//     const mouseDownEvent = new MouseEvent('mousedown');
//     const event = new MouseEvent('mouseup');
//     dispatchEvent(mouseDownEvent);
//     ShapeTest.onMouseDown(mouseDownEvent);
//     dispatchEvent(event);
//     ShapeTest.onMouseLeave();
//     expect(spy).toHaveBeenCalled();
//   });

//   it('should create an instance of the derived class', () => {
//     expect(new ShapeTest()).toBeTruthy();
//   });

//   it('should create an instance of the derived class', () => {
//     expect(new ShapeTest()).toBeTruthy();
//   });

//   it('should create an instance of the derived class', () => {
//     expect(new ShapeTest()).toBeTruthy();
//   });

//   it('should create an instance of the derived class', () => {
//     expect(new ShapeTest()).toBeTruthy();
//   });
// });
