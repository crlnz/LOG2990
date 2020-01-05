/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingImportsModule } from '../../../testing-imports/testing-imports';
import { ColorPaletteComponent } from '../../color-tools/color-palette/color-palette.component';
import { ColorPickerComponent } from '../../color-tools/color-picker/color-picker.component';
import { ColorSelectorComponent } from '../../color-tools/color-selector/color-selector.component';
import { DrawingToolAttributesComponent } from '../attributes-drawing-tool/attributes-drawing-tool.component';
import { AttributesEraserComponent } from '../attributes-eraser/attributes-eraser.component';
import { AttributesSelectComponent } from '../attributes-select/attributes-select.component';
import { ShapeAttributesComponent } from '../attributes-shapes/attributes-shapes.component';
import { AttributesStampComponent } from '../attributes-stamp/attributes-stamp.component';
import { AttributesTextComponent } from '../attributes-text/attributes-text.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';
import { AttributesPanelComponent } from './attributes-panel.component';
import { AttributesPaintBucketComponent } from '../attributes-paint-bucket/attributes-paint-bucket.component';

describe('AttributesPanelComponent', () => {
  let component: AttributesPanelComponent;
  let fixture: ComponentFixture<AttributesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttributesPanelComponent, ColorPickerComponent, ShapeAttributesComponent,
        DrawingToolAttributesComponent, ColorPaletteComponent, ColorSelectorComponent,
        GridOptionsComponent, AttributesStampComponent, AttributesSelectComponent, AttributesEraserComponent,
        AttributesTextComponent, AttributesPaintBucketComponent],
      imports: [TestingImportsModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(AttributesPanelComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
