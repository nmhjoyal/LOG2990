import { OnDestroy, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ToolAbstract } from './tool-abstract';

class TestTool extends ToolAbstract implements OnDestroy, OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    // empty body
  }

  ngOnDestroy(): void {
    // empty body
  }

}

describe('ToolAbstract', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create an instance', () => {
    expect(new TestTool()).toBeTruthy();
  });
});
