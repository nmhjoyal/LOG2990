import { OnDestroy, OnInit } from '@angular/core';

export abstract class ToolAbstract implements OnInit, OnDestroy {

  constructor() {
    // empty body
  }

  abstract ngOnInit(): void;

  abstract ngOnDestroy(): void;
}
