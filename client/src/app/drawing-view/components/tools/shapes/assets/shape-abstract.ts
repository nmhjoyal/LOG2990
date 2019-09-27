import { OnInit, Input, HostListener } from '@angular/core';
import { ShapeService } from './shape.service';

const DEFAULT_OPACITY = 1;
const DEFAULT_STROKE_WIDTH = 2;

export abstract class ShapeAbstract implements OnInit {
    protected _cursorX:number;
    protected _cursorY:number;
    protected _previewWidth:number;
    protected _previewHeight:number;
    protected _strokeOpacity:number = DEFAULT_OPACITY;
    protected _fillOpacity:number = DEFAULT_OPACITY;
    protected _strokeWidth:number = DEFAULT_STROKE_WIDTH;
    protected _shapeHeight: number = 0;
    protected _shapeWidth: number = 0;
    protected _x:number = 0;
    protected _y:number = 0;
    protected _shapeX:number = 0;
    protected _shapeY:number = 0;
    protected _mouseDown: boolean = false;
    protected _shiftDown: boolean = false;
  
    @Input() windowHeight: number;
    @Input() windowWidth: number;

    protected _shapeService: ShapeService;
    
    constructor(serviceInstance:ShapeService) {
      this._shapeService = serviceInstance;
    }
  
    ngOnInit() {
    }
  
    // Abstract methods

    protected abstract saveShape():void;
    protected abstract calculateDimensions():void;

    // Event handling methods
  

    @HostListener('mousedown', ['$event']) onMouseDown(event:any){
      this._x=event.offsetX;
      this._y=event.offsetY;
      this._mouseDown = true;
    }
  
    @HostListener('mouseup') onMouseUp(){
      this._mouseDown = false;
      
      if(!(this._shapeHeight == 0 && this._shapeWidth == 0))
      this.saveShape();
  
      this._shapeHeight = 0;
      this._shapeWidth = 0;
      this._previewHeight = 0;
      this._previewWidth = 0;
      this._x=0;
      this._y=0;
    }
    
    @HostListener('mouseleave') onMouseleave(){
      if(this._mouseDown)
      this.onMouseUp();
    }
  
    @HostListener('mousemove', ['$event']) onMouseMove(event:any){
      this._cursorX = event.offsetX;
      this._cursorY = event.offsetY;
      
      if(this._mouseDown){
        this._previewWidth = event.offsetX - this._x;
        this._previewHeight = event.offsetY - this._y;
        this.calculateDimensions();
      }
    }
  
    @HostListener('keyup.shift') onShiftUp(){
      this._shiftDown = false;
      if(this._mouseDown)
      this.calculateDimensions();
    }
  
    @HostListener('keydown.shift') onShiftDown(){
      this._shiftDown = true;
      if(this._mouseDown)
      this.calculateDimensions();
    }
  
  
    //Functions
  
  
    decreaseStrokeWidth(): void{
      if(this._strokeWidth != 0)
      this._strokeWidth--;
    }
  
    increaseStrokeWidth(): void{
      this._strokeWidth++;
    }
  
    setTraceMode(mode:number): void{//MAKE CONSTANTS FOR MODES
      switch (mode) {
        case 1://Contour
          this._strokeOpacity = 1;//load from service
          this._fillOpacity = 0;
          break;
        
        case 2://Fill
          this._strokeOpacity = 0;
          this._fillOpacity = 1;//load from service
          break;
      
        case 3://Contour&Fill
            this._strokeOpacity = 1;//load from service
            this._fillOpacity = 1;//load from service
            break;
  
        default:
          break;
      }
  
    }
  
  
    //Getter methods
  
    getX(): number{
      return this._x;
    }
  
    getY(): number{
      return this._y;
    }
  
    getShapeX(): number{
      return this._shapeX;
    }
  
    getShapeY(): number{
      return this._shapeY;
    }
  
    getPreviewWidth(): number{
      return this._previewWidth;
    }
  
    getPreviewHeight(): number{
      return this._previewHeight;
    }
  
    getShapeWidth(): number{
      return this._shapeWidth;
    }
  
    getShapeHeight(): number{
      return this._shapeHeight;
    }
  
    getStrokeWidth(): number{
      return this._strokeWidth; 
    }
  
    getStrokeOpacity(): number{
      return this._strokeOpacity;
    }
  
    getFillOpacity(): number{
      return this._fillOpacity;
    }
  
  
    //Color service simulating methods
  
    getPrimeColor(): string{
      return this._shapeService.primaryColour;
    }
  
    getSecondColor(): string{
      return this._shapeService.secondaryColour;
    }
  
    switchColor(): void{
      this._shapeService.switchColor();
    }
}

