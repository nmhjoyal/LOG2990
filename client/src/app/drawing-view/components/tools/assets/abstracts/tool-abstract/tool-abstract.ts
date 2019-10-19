import { Input, OnDestroy, OnInit } from '@angular/core';
import { IPreviewBox, IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ColorService } from 'src/app/services/color_service/color.service';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { AttributesService } from '../../attributes/attributes.service';

export abstract class ToolAbstract implements OnInit, OnDestroy {
  protected initialX: number;
  protected initialY: number;
  protected cursorX: number;
  protected cursorY: number;
  protected mouseDown: boolean;
  protected shiftDown: boolean;
  protected previewBox: IPreviewBox;
  protected shape: IShape;
  protected traceMode: number;

  @Input() windowHeight: number;
  @Input() windowWidth: number;

  constructor(protected toolService: ToolHandlerService,
              protected attributesService: AttributesService,
              protected colorService: ColorService) {
    this.mouseDown = false;
    this.shiftDown = false;
    this.initialX = 0;
    this.initialY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
  }

  abstract ngOnInit(): void;

  abstract ngOnDestroy(): void;

  // Functions

  protected decreaseStrokeWidth(): void {
    if (this.shape.strokeWidth !== 0) {
      this.shape.strokeWidth--;
    }
  }

  protected increaseStrokeWidth(): void {
    this.shape.strokeWidth++;
  }

}
