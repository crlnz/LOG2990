/* tslint:disable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributesEraserComponent } from './attributes-eraser.component';
import { EraserService } from 'src/app/services/eraser/eraser.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';

describe('AttributesEraserComponent', () => {
  let component: AttributesEraserComponent;
  let fixture: ComponentFixture<AttributesEraserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesEraserComponent ],
      imports: [TestingImportsModule],
      providers:[EraserService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesEraserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the text size',()  => {
    const eraserService= TestBed.get(EraserService);
    component=new AttributesEraserComponent(eraserService);
    component['eraserSize']=10;
    component['updateSize']();
    spyOn(component['eraserService'],'eraserSize');
    expect(component['eraserSize']).toEqual(10);
  });
});