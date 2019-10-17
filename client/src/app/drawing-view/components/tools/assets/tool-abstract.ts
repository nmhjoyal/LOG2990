import { OnInit } from '@angular/core';
import { ITools } from './interfaces/itools';

export abstract class ToolAbstract implements OnInit{

    protected drawing: ITools;

    constructor(){}

    ngOnInit() {
        // empty block
    }

    
}
