/* tslint:disable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef} from '@angular/material/dialog';
import { ColorService } from 'src/app/services/color/color.service';
import { ShortcutsService } from 'src/app/services/shortcuts/shortcuts.service';
import { TestingImportsModule } from 'src/app/testing-imports/testing-imports';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let service: ColorService;
  let shortcut: ShortcutsService;
  let dialogref: MatDialogRef<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickerComponent, ColorPaletteComponent ],
      imports: [TestingImportsModule],
      providers: [{provide : MatDialogRef, useValue : {}}],
    });
    service = new ColorService();
    shortcut = TestBed.get(ShortcutsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogref = TestBed.get(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the color to upperCase', () => {
    const color = 'red';
    component['updateColorPalette'](color);
    expect(component.color).toBe(color.toUpperCase());
  });

  it('should return the color when getColor() is called', () => {
    const color = 'red';
    component['updateColorPalette'](color);
    expect(component['getColor']()).toEqual(color.toUpperCase());
  });

  it('should show a window alert if the user doesnt enter a valid color format', () => {
    spyOn(component, 'colorManual').and.callThrough();
    const color = 'test';
    component.colorManual(color);
    expect(component['hexError']).toBe(true);
  });

  it('should update the color palette if the entered color has a valid format', () => {
    spyOn(component, 'colorManual').and.callThrough();
    const color = '#ffffff';
    component['updateColorPalette'](color);
    expect(component['getColor']()).toEqual(color.toUpperCase());
  });
});
