/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPaletteComponent ],
      imports: [TestingImportsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});