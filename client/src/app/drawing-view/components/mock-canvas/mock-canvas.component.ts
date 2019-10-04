import { Component, OnInit, Inject } from '@angular/core';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { ToolHandlerService } from 'src/app/services/tool-handler/tool-handler.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mock-canvas',
  templateUrl: './mock-canvas.component.html',
  styleUrls: ['./mock-canvas.component.scss'],
})
export class MockCanvasComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: NewDrawingModalData, public storage: ToolHandlerService) {
    // empty body
  }

  ngOnInit() {
    // empty block
  }

}
