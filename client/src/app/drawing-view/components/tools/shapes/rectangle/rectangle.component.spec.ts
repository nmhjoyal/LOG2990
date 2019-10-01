import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { LOCAL_STORAGE } from 'ngx-webstorage-service';
import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { RectangleComponent } from './rectangle.component';

describe('RectangleComponent', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  const storageServiceMock: jasmine.SpyObj<LocalStorageService> = jasmine.createSpyObj('LocalStorageService', ['']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserDynamicTestingModule],
      declarations: [RectangleComponent],
      providers: [
        { provide: LOCAL_STORAGE, useValue: storageServiceMock, },
      ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
