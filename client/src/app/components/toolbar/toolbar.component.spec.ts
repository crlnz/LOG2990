/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IconService } from 'src/app/services/Icon/icon.service';
import { TestingImportsModule } from '../../testing-imports/testing-imports';
import { ColorPaletteComponent } from '../color-tools/color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-tools/color-picker/color-picker.component';
import { ColorSelectorComponent } from '../color-tools/color-selector/color-selector.component';
import { CreateDrawingModalComponent } from '../create-drawing/create-drawing.component';
import { ExportDrawingComponent } from '../export-drawing/export-drawing.component';
import { OpenDrawingComponent } from '../open-drawing/open-drawing.component';
import { SanitizeHtmlPipe } from '../open-drawing/sanitizeHtml.pipe';
import { SaveDrawingComponent } from '../save-drawing/save-drawing.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';
import { DrawingToolAttributesComponent } from './attributes-drawing-tool/attributes-drawing-tool.component';
import { AttributesEraserComponent } from './attributes-eraser/attributes-eraser.component';
import { AttributesPanelComponent } from './attributes-panel/attributes-panel.component';
import { AttributesSelectComponent } from './attributes-select/attributes-select.component';
import { ShapeAttributesComponent } from './attributes-shapes/attributes-shapes.component';
import { AttributesStampComponent } from './attributes-stamp/attributes-stamp.component';
import { AttributesTextComponent } from './attributes-text/attributes-text.component';
import { GridOptionsComponent } from './grid-options/grid-options.component';
import { Icon } from './icon';
import { ToolbarComponent } from './toolbar.component';
import { AttributesPaintBucketComponent } from './attributes-paint-bucket/attributes-paint-bucket.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let icon: Icon;
  let iconService: IconService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent, CreateDrawingModalComponent, AttributesPanelComponent,
         UserGuideComponent, ColorPaletteComponent, ColorPickerComponent, ShapeAttributesComponent,
         DrawingToolAttributesComponent, ColorSelectorComponent, GridOptionsComponent, OpenDrawingComponent,
         SaveDrawingComponent, SanitizeHtmlPipe, ExportDrawingComponent, AttributesTextComponent,
         AttributesSelectComponent, AttributesStampComponent, AttributesEraserComponent, AttributesPaintBucketComponent],
      imports: [TestingImportsModule],
      providers: [IconService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle panel if icon matches', () => {
    icon = {
      name: 'icon',
      iconImage: 'image',
      hover:''
    };
    component['drawingService'].created = true; 
    component['selectedIcon'] = icon;
    const spy: any = spyOn<any>(component, 'toggleAttributesPanel');
    component['onSelect'](icon);
    expect(spy).toHaveBeenCalled();
  });

  it('should toggle panel if icon doesnt match', () => {
    icon = {
      name: 'icon',
      iconImage: 'image',
      hover:''
    };
    component['selectedIcon'] = icon;
    component['drawingService'].created = true; 
    const spy: any = spyOn<any>(component, 'toggleAttributesPanel');
    const notIcon = {
      name: 'notIcon',
      iconImage: 'image',
      hover: ''
    };
    component['showPanel'] = false;
    component['onSelect'](notIcon);
    expect(spy).toHaveBeenCalled();
  });

  it('should  select icon', () => {
    icon = {
      name: 'icon',
      iconImage: 'image',
      hover:''
    };
    component['drawingService'].created = true; 
    iconService = TestBed.get(IconService);
    const spy = spyOn(iconService, 'toolClicked');
    component['selectedIcon'] = icon;
    component['showPanel'] = false;
    component['onSelect'](icon);
    expect(component['selectedIcon']).toEqual(icon);
    expect(spy).toHaveBeenCalled();
  });
});
