import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorService } from 'src/app/services/color/color.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { PaintBucketService } from 'src/app/services/paintBucket/paint-bucket.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { AttributesPaintBucketComponent } from './attributes-paint-bucket.component';

describe('AttributesPaintBucketComponent', () => {
  let component: AttributesPaintBucketComponent;
  let fixture: ComponentFixture<AttributesPaintBucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesPaintBucketComponent ],
      imports: [TestingImportsModule],
      providers: [PaintBucketService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesPaintBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sendTolerance', () => {
    const colorService = new ColorService();
    const drawingService = new DrawingService();
    const paintBucketService = new PaintBucketService(colorService, drawingService);
    expect(paintBucketService.tolerance).toEqual(component.tolerance);
  });

  it('should sendStrokeWidth', () => {
    const colorService = new ColorService();
    const drawingService = new DrawingService();
    const paintBucketService = new PaintBucketService(colorService, drawingService);
    expect(paintBucketService.strokeWidth).toEqual(component.strokeWidth);
  });

  it('should sendType', () => {
    const colorService = new ColorService();
    const drawingService = new DrawingService();
    const paintBucketService = new PaintBucketService(colorService, drawingService);
    expect(paintBucketService.traceType).toEqual(component.selectedType);
  });
});
