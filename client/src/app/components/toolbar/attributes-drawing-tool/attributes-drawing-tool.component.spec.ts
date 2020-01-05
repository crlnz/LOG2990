/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingToolService } from 'src/app/services/drawing-tools/drawing-tools.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { DrawingToolAttributesComponent } from './attributes-drawing-tool.component';

describe('DrawingToolAttributesComponent', () => {
  let component: DrawingToolAttributesComponent;
  let fixture: ComponentFixture<DrawingToolAttributesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingToolAttributesComponent ],
      imports: [TestingImportsModule],
      providers: [DrawingToolService, ShortcutsService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingToolAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sendWidth', () => {
    const drawingToolService=TestBed.get(DrawingToolService);
    component=new DrawingToolAttributesComponent(drawingToolService);
    component['width']=2;
    component['sendWidth']();
    expect(component['drawingToolService'].strokeWidth).toEqual(2);

  });

  it('should sendMinPenWidth', () => {
    const drawingToolService=TestBed.get(DrawingToolService);
    component=new DrawingToolAttributesComponent(drawingToolService);
    component['minWidth']=2;
    component['sendMinPenWidth']();
    expect(component['drawingToolService'].minTip).toEqual(2);

  });

  it('should sendMaxPenWidth', () => {
    const drawingToolService=TestBed.get(DrawingToolService);
    component=new DrawingToolAttributesComponent(drawingToolService);
    component['maxWidth']=2;
    component['sendMaxPenWidth']();
    expect(component['drawingToolService'].maxTip).toEqual(10);

  });

  it('should sendTexture', () => {
    const drawingToolService=TestBed.get(DrawingToolService);
    component=new DrawingToolAttributesComponent(drawingToolService);
    component['selectedTexture']='a';
    component['sendTexture']();
    expect(component['drawingToolService'].texture).toEqual('a');

  });

  it('should sendDiameter', () => {
    const drawingToolService=TestBed.get(DrawingToolService);
    component=new DrawingToolAttributesComponent(drawingToolService);
    component['diameter']=2;
    component['sendDiameter']();
    expect(component['drawingToolService'].diameter).toEqual(2);

  });
  it('should sendPattern', () => {
    const drawingToolService=TestBed.get(DrawingToolService);
    component=new DrawingToolAttributesComponent(drawingToolService);
    component['selectedPattern']='a';
    component['sendPattern']();
    expect(component['drawingToolService'].pattern).toEqual('a');

  });

  it('should sendJunction', () => {
    const drawingToolService=TestBed.get(DrawingToolService);
    component=new DrawingToolAttributesComponent(drawingToolService);
    component['selectedJuntion']='a';
    component['displayPoint']=false;
    component['sendJunction']();
    expect(component['drawingToolService'].junction).toEqual('a');
    expect(component['drawingToolService'].displayPoint).toEqual(false);
  });
});
