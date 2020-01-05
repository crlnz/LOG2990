/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { ShapeAttributesComponent } from './attributes-shapes.component';

describe('ShapeAttributesComponent', () => {
  let component: ShapeAttributesComponent;
  let fixture: ComponentFixture<ShapeAttributesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeAttributesComponent ],
      imports: [TestingImportsModule],
      providers: [ShortcutsService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});