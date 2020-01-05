/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from 'src/app/services/color/color.service';
import { DrawingToolService } from 'src/app/services/drawing-tools/drawing-tools.service';
import { DrawingService } from 'src/app/services/drawing/drawing.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { IconService } from 'src/app/services/Icon/icon.service';
import { SelectionService } from 'src/app/services/selection/selection.service';
import { ShapeService } from 'src/app/services/shape/shape.service';
import { StampService } from 'src/app/services/stamp/stamp.service';
import { ToolsService } from 'src/app/services/tools/tools.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { GridOptionsComponent } from './grid-options.component';
import { ManipulationService } from 'src/app/services/manipulation/manipulation.service';

describe('GridOptionsComponent', () => {
  let component: GridOptionsComponent;
  let fixture: ComponentFixture<GridOptionsComponent>;
  const gridService = new GridService();
  component = new GridOptionsComponent(gridService);
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridOptionsComponent ],
      imports: [TestingImportsModule],
      providers: [GridService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the toggleGridClicked method when afficherGrille=true ', () => {
    const spy = spyOn<any>(component, 'toggleGrid');
    component['afficherGrille'] = true;
    component['toggleGrid']();
    expect(spy).toHaveBeenCalled();
    expect(component['afficherGrille']).toBe(true);
    expect((component['buttonText'])).toEqual('Afficher');
  });

  it('should call the toggleGridClicked method when afficherGrille=false ', () => {
    const spy = spyOn<any>(component, 'toggleGrid');
    component['afficherGrille'] = false;
    component['toggleGrid']();
    expect(spy).toHaveBeenCalled();
    expect(component['afficherGrille']).toBe(false);
    expect((component['buttonText'])).toEqual('Afficher');
  });

  it('should call the updateTransparency method ', () => {
    const spy = spyOn<any>(component, 'updateTransparency');
    component['updateTransparency'](5);
    expect(component['transparencyValue']).toEqual(1 / (component['gridTransparency']));
    expect(spy).toHaveBeenCalled();
  });

  it('should call the updateSquareSize method ', () => {
    const spy = spyOn<any>(component, 'updateSquareSize');
    component['updateSquareSize'](5);
    expect(spy).toHaveBeenCalled();
  });
});
